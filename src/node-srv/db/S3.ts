
const Minio = require('minio')
const { Readable } = require('stream')

export class S3 {

    minioClient
    bucket 

    constructor() {

        this.minioClient = new Minio.Client({
            endPoint: 'ewr1.vultrobjects.com',
            accessKey: 'QVJDCMTBVDZLLQTJVND1',
            secretKey: 'WrUKYmuNEhs1EdE9w1rXsqnKczgWoB9nCLj2mTTu'
        })

    }

    async _writeX()  {

        var path = 'oh2/d'
        var fileO =  Readable.from("Oh hi")
        await this._writeOne(path, fileO)
        
    }

    _writeOne(path, fileO) { // len pro
        const THIZ = this
        return new Promise(function(resolve, reject) {
            THIZ.minioClient.putObject(THIZ.bucket, path, fileO,  function(err) { //sz, THIZ.metaData,
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.log('uploaded successfully.')
                resolve()
              })
        })
    }//()

    Qdev = {} // a map of lists,  to be updated every fraction of a second
    qDev( short_domain, year_month_day, continent, params) {
        const path = short_domain +'/'+ year_month_day +'/'+continent
         
        let exists = this.Qdev[path]
        if (!exists) this.Qdev[ path] = []

        this.Qdev[path].push(params)
    }//()

    Qmet = {} // a map of lists,  to be updated every fraction of a second
    qMet( short_domain, year_month_day, continent, params) {
        const path = short_domain +'/'+ year_month_day +'/'+continent
         
        let exists = this.Qmet[path]
        if (!exists) this.Qmet[ path] = []

        this.Qmet[path].push(params)
    }//()


    _write(q) { // called on a timer. emits domain event at end of write
        // by table,  by short_domain, by year_month_day, by continent

        var path
        var file



    }


}//class