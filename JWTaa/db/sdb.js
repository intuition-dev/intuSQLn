"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const Minio = require('minio');
const { Readable } = require('stream');
// GUID
// handle
// single file 
class FDB {
    constructor() {
        this.log = new terse_b_1.TerseB(this.constructor.name);
        this.Qdev = {}; // a map of lists,  to be updated every fraction of a second
        this.Qmet = {}; // a map of lists,  to be updated every fraction of a second
        this.minioClient = new Minio.Client({
            endPoint: 'ewr1.vultrobjects.com',
            accessKey: 'QVJDCMTBVDZLLQTJVND1',
            secretKey: 'WrUKYmuNEhs1EdE9w1rXsqnKczgWoB9nCLj2mTTu'
        });
    } //()
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
    } //()
    qDev(short_domain, year_month_day, continent, params) {
        const path = short_domain + '/' + year_month_day + '/' + continent;
        let exists = this.Qdev[path];
        if (!exists)
            this.Qdev[path] = [];
        this.Qdev[path].push(params);
    } //()
    qMet(short_domain, year_month_day, continent, params) {
        const path = short_domain + '/' + year_month_day + '/' + continent;
        let exists = this.Qmet[path];
        if (!exists)
            this.Qmet[path] = [];
        this.Qmet[path].push(params);
    } //()
    async _write(q) {
        // by table,  by short_domain, by year_month_day, by continent
        var path;
        var fileO = Readable.from("Oh hi");
        await this._writeOne(path, fileO);
    }
} //class
exports.FDB = FDB;
