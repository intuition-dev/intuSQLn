
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

    writeOne(path, data) {  // will overwrite
        const str = JSON.stringify(data) //encode
        const fileO =  Readable.from(str) // fileO is a stream, eg   var fileO =  Readable.from("Oh hi") 

        const THIZ = this
        const metaData ={a: 'b'}
        return new Promise(function(resolve, reject) {
            THIZ.minioClient.putObject(THIZ.bucket, path, fileO, null, metaData, function(err) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.log('saved/uploaded successfully.')
                resolve()
              })
        })
    }//()

    readOne(path) {

        var size = 0
        this.minioClient.getObject('mybucket', 'photo.jpg', function(err, dataStream) {
            if (err) {
              return console.log(err)
            }
            dataStream.on('data', function(chunk) {
              size += chunk.length
            })
            dataStream.on('end', function() {
              console.log('End. Total size = ' + size)
            })
            dataStream.on('error', function(err) {
              console.log(err)
            })
          })

    }

    list(path) {
        var stream = this.minioClient.listObjectsV2WithMetadata(this.bucket,path, true,'')
        
        stream.on('data', function(obj) { 
            console.log(obj) 
            
        } )

        stream.on('error', function(err) { console.log(err) } )
    }

}//class