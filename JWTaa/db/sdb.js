"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const Minio = require('minio');
const { Readable } = require('stream');
// GUID
// handle
class SDB {
    constructor() {
        this.log = new terse_b_1.TerseB(this.constructor.name);
        this.minioClient = new Minio.Client({
            endPoint: 'ewr1.vultrobjects.com',
            accessKey: '0X4E06GBGUV1H1C5T0VE',
            secretKey: 'AdIr5P13vmvXl0IHsh7i1xCWhMafth8XPhxRV8Ju'
        });
        this.bucket = 'aausers';
    } //()
    async tst() {
        //await this.writeOne('/one/me', {d:'c'})
        const data = this.readOne('/one/me');
        this.log.info(data);
        //const l = this.list('/one')
        //this.log.warn(l)
    }
    writeOne(fullPath, data) {
        const str = JSON.stringify(data); //encode
        const fileO = Readable.from(str); // fileO is a stream, eg   const fileO =  Readable.from("Oh hi") 
        const THIZ = this;
        const metaData = { a: 'b' };
        return new Promise(function (resolve, reject) {
            THIZ.minioClient.putObject(THIZ.bucket, fullPath, fileO, null, metaData, function (err) {
                if (err) {
                    THIZ.log.warn(err);
                    reject(err);
                }
                THIZ.log.info('saved/uploaded successfully.');
                resolve();
            });
        }); //pro
    } //()
    readOne(fullPath) {
        let chunks = [];
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ.minioClient.getObject(THIZ.bucket, fullPath, function (err, dataStream) {
                if (err) {
                    THIZ.log.warn(err);
                    reject(err);
                }
                dataStream.on('data', function (chunk) {
                    chunks.push(chunk);
                });
                dataStream.on('end', function () {
                    const json = Buffer.concat(chunks).toString();
                    THIZ.log.info(json);
                    const data = JSON.parse(json);
                    resolve(data);
                });
                dataStream.on('error', function (err) {
                    THIZ.log.warn(err);
                    reject(err);
                });
            });
        }); //pro
    }
    list(path) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            const stream = THIZ.minioClient.listObjectsV2(THIZ.bucket, path, true, '');
            stream.on('data', function (obj) {
                THIZ.log.info(obj);
                resolve(obj);
            });
            stream.on('error', function (err) {
                THIZ.log.warn(err);
                reject(err);
            });
        }); //pro
    } //()
} //class
exports.SDB = SDB;
