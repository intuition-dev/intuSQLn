
const Minio = require('minio')
const streamLength = require("stream-length")
const { Readable } = require('stream')

export class S3 {

    minioClient
    bucket 

    metaData = {
        'Content-Type': 'application/octet-stream',
    }

    constructor() {
        this.bucket = 'snx01'
        
        this.minioClient = new Minio.Client({
            endPoint: 'ewr1.vultrobjects.com',
            useSSL: false,
            accessKey: 'QVJDCMTBVDZLLQTJVND1',
            secretKey: 'WrUKYmuNEhs1EdE9w1rXsqnKczgWoB9nCLj2mTTu'
        })

        this._writeX()
    }

    async _writeX()  {

        var path = '/oh'
        var fileO =  Readable.from("Oh hi")
        var sz = await  this.len(fileO)
        //await this._writeOne(path, fileO, sz);
        
    }

    _writeOne(path, fileO, sz) { // len pro
        const THIZ = this
        return new Promise(function(resolve, reject) {
            THIZ.minioClient.putObject(THIZ.bucket, path, fileO, sz, THIZ.metaData, function(err) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.log('uploaded successfully.')
                resolve()
              })
        })
    }//()

    len(fileO) { // len pro
        return new Promise(function(resolve, reject) {
            streamLength(fileO, function(err, len) {
                if(err) {
                    console.log(err)
                    reject(err)
                }
                resolve(len) // return promise
            })
        })
    }


    Q = {} // a map of lists to be updated every fraction of a second


    write(folder, short_domain, year_month_day, continent, params) {

        let exists = this.Q[folder +'/'+ short_domain +'/'+ year_month_day +'/'+continent]

        if (!exists) this.Q[folder +'/'+ short_domain +'/'+ year_month_day +'/'+continent] = []

        this.Q[folder +'/'+ short_domain +'/'+ year_month_day +'/'+continent].push(params)

    }


    _write(q) { // called on a timer. emits domain event at end of write
        // by table,  by short_domain, by year_month_day, by continent

        var path
        var file

        this.minioClient.fPutObject(this.bucket, path, file, this.metaData, function(err, etag) {
            if (err) return console.log(err)
            console.log('uploaded successfully.')
          })

    }


}//class