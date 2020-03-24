
import { TerseB } from "terse-b/terse-b"

const Minio = require('minio')
const { Readable } = require('stream')
const uuid = require('uuid/v4')
const bcrypt = require('bcryptjs') // to hash passwords

const NodeCache = require( "node-cache" )
const cache = new NodeCache({stdTTL: 100, maxKeys: 10*1000})


// could be msgPack, but using json for now

/**
 * S3 DB
 */
export class BaseSDB {
log:any = new TerseB(this.constructor.name) 

minioClient
bucket 

guid() {
    return uuid()
}

get cache() {
    return cache
}

hashPass(password, salt) {
    return bcrypt.hashSync(password, salt) 
}
genSalt() {
    return bcrypt.genSaltSync(10)
}

constructor(config, bucket) {
    this.minioClient = new Minio.Client(
        config
    )
    this.bucket = bucket
}//()

writeOne(fullPath, data) {  // will overwrite
    const str = JSON.stringify(data) //encode
    const fileO =  Readable.from(str) // fileO is a stream, eg   const fileO =  Readable.from("Oh hi") 

    const THIZ = this
    const metaData ={a: 'b'}
    return new Promise(function(resolve, reject) {
        THIZ.minioClient.putObject(THIZ.bucket, fullPath, fileO, null, metaData, function(err) {
            if (err) {
                THIZ.log.warn(err)
                reject(err)
            }
            THIZ.log.info('saved/uploaded successfully.')
            resolve()
        })
    })//pro
}//()

readOne(fullPath) {
    let chunks = []
    
    const THIZ = this
    return new Promise(function(resolve, reject) {
        THIZ.minioClient.getObject(THIZ.bucket, fullPath, function(err, dataStream) {
            if (err) {
                THIZ.log.warn(err)
                reject(err)
            }
            dataStream.on('data', function(chunk) {
                chunks.push(chunk)
            })
            dataStream.on('end', function() {
                const json = Buffer.concat(chunks).toString()
                THIZ.log.info(json)
                const data = JSON.parse(json)
                THIZ.log.info(data)
                resolve(data)

            })

            dataStream.on('error', function(err) {
                THIZ.log.warn(err)
                reject(err)
            })
        })
    })//pro
}

list(path) {
    let objects = []

    const THIZ = this
    return new Promise(function(resolve, reject) {
        const stream = THIZ.minioClient.listObjectsV2(THIZ.bucket, path, true)
        stream.on('data', function(obj) { 
            THIZ.log.info(obj) 
            objects.push(obj)
        } )
        stream.on('end', function() {
            resolve(objects)
        })
        stream.on('error', function(err) { 
            THIZ.log.warn(err) 
            reject(err)
        } )

    })//pro
}//()

delOne(fullPath) {
    const THIZ = this
    return new Promise(function(resolve, reject) {
        THIZ.minioClient.removeObject(THIZ.bucket, fullPath, function(err) {
            if (err) {
                THIZ.log.warn(err)
                reject(err)
            }
            resolve()
        })
    })//pro
}//()

}//class