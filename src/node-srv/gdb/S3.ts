
var Minio = require('minio')

class S3 {

    constructor() {
        
        var minioClient = new Minio.Client({
            endPoint: 'play.min.io',
            port: 9000,
            useSSL: true,
            accessKey: 'Q3AM3UQ867SPQQA43P2F',
            secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
        })
    }



}