
import { TerseB } from "terse-b/terse-b"

const Minio = require('minio')
const { Readable } = require('stream')

// GUID

// handle

// single file 

export class FDB {
log:any = new TerseB(this.constructor.name) 

minioClient
bucket 

constructor() {
    this.minioClient = new Minio.Client({
        endPoint: 'ewr1.vultrobjects.com',
        accessKey: '0X4E06GBGUV1H1C5T0VE',
        secretKey: 'AdIr5P13vmvXl0IHsh7i1xCWhMafth8XPhxRV8Ju'
    })

    this.bucket = 'aausers'
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
    const stream = this.minioClient.listObjectsV2WithMetadata(this.bucket,path, true,'')
    
    stream.on('data', function(obj) { 
        THIZ.log.warn(obj) 
        
    } )

    stream.on('error', function(err) { THIZ.log.warn(err) } )
}//()

}//class