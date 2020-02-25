"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Minio = require('minio');
const { Readable } = require('stream');
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
class S3 {
    constructor() {
        this.log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
        this.Qdev = {};
        this.Qmet = {};
        this.minioClient = new Minio.Client({
            endPoint: 'ewr1.vultrobjects.com',
            accessKey: 'QVJDCMTBVDZLLQTJVND1',
            secretKey: 'WrUKYmuNEhs1EdE9w1rXsqnKczgWoB9nCLj2mTTu'
        });
    }
    _writeOne(path, fileO) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ.minioClient.putObject(THIZ.bucket, path, fileO, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                console.log('uploaded successfully.');
                resolve();
            });
        });
    }
    qDev(short_domain, year_month_day, continent, params) {
        const path = short_domain + '/' + year_month_day + '/' + continent;
        let exists = this.Qdev[path];
        if (!exists)
            this.Qdev[path] = [];
        this.Qdev[path].push(params);
    }
    qMet(short_domain, year_month_day, continent, params) {
        const path = short_domain + '/' + year_month_day + '/' + continent;
        let exists = this.Qmet[path];
        if (!exists)
            this.Qmet[path] = [];
        this.Qmet[path].push(params);
    }
    async _write(q) {
        var path;
        var fileO = Readable.from("Oh hi");
        await this._writeOne(path, fileO);
    }
}
exports.S3 = S3;
