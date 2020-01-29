
var Minio = require('minio')

class S3 {

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




}