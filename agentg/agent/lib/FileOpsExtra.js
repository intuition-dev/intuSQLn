"use strict";
// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dirs = exports.VersionNag = exports.DownloadFrag = exports.YamlConfig = exports.DownloadC = void 0;
const terse_b_1 = require("terse-b/terse-b");
const fs = require("fs-extra");
const AdmZip = require("adm-zip");
const yaml = require("js-yaml");
const { DownloaderHelper } = require('node-downloader-helper');
const fetch = require('make-fetch-happen');
const path = require("path");
const FileHound = require("filehound");
class DownloadC {
    constructor(key_, targetDir_) {
        this._log = new terse_b_1.TerseB(this.constructor.name);
        this.key = key_;
        this.targetDir = targetDir_;
    } // cons
    autoUZ() {
        const THIZ = this;
        this.getVal().then(function (url) {
            THIZ._log.info(url);
            const fn = THIZ.getFn(url);
            THIZ._log.info(fn);
            THIZ.down(url).then(function () {
                THIZ.unzip(fn);
            });
        });
    }
    auto() {
        const THIZ = this;
        this.getVal().then(function (url) {
            console.log(url);
            THIZ.down(url);
        });
    }
    checkVer(lver) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ.getVal().then(function (ver) {
                THIZ._log.info(ver, lver);
                if (ver == lver)
                    resolve(true);
                else
                    resolve(false);
            });
        }); //pro
    }
    getVal() {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            fetch(DownloadC.truth).then((response) => {
                return response.text();
            })
                .then(data => {
                let dic = yaml.load(data);
                resolve(dic[THIZ.key]);
            }).catch(err => {
                THIZ._log.warn('err: where is the vfile?', err, DownloadC.truth);
            });
        }); //pro
    } //()
    getFn(url) {
        const pos = url.lastIndexOf('/');
        return url.substring(pos);
    }
    down(url) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            const dl = new DownloaderHelper(url, THIZ.targetDir);
            dl.on('end', () => {
                THIZ._log.info('downloaded');
                resolve('OK');
            });
            dl.on('error', err => console.error('Where is the file ' + url, err));
            dl.start();
        }); //pro
    } //()
    unzip(fn) {
        const zfn = this.targetDir + fn;
        this._log.info(zfn);
        const zip = new AdmZip(zfn);
        zip.extractAllTo(this.targetDir, /*overwrite*/ true);
        fs.remove(this.targetDir + '/' + fn);
    }
} //class
exports.DownloadC = DownloadC;
// in docs root via git
DownloadC.truth = 'https://INTUITION-dev.github.io/mbCLI/versions.yaml';
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
class YamlConfig {
    constructor(fn) {
        this._log = new terse_b_1.TerseB(this.constructor.name);
        let cfg = yaml.load(fs.readFileSync(fn));
        this._log.info(cfg);
        return cfg;
    } //()
} //class
exports.YamlConfig = YamlConfig;
class DownloadFrag {
    constructor(dir) {
        this._log = new terse_b_1.TerseB(this.constructor.name);
        console.log('Extracting to', dir);
        new DownloadC('headFrag', dir).auto();
    } //()
}
exports.DownloadFrag = DownloadFrag;
class VersionNag {
    constructor() {
        this._log = new terse_b_1.TerseB(this.constructor.name);
    }
    static isCurrent(prod, ver) {
        const down = new DownloadC(prod, null);
        return down.checkVer(ver);
    }
}
exports.VersionNag = VersionNag;
class Dirs {
    constructor(dir_) {
        this._log = new terse_b_1.TerseB(this.constructor.name);
        let dir = Dirs.slash(dir_);
        this.dir = dir;
    }
    static slash(path_) {
        return path_.replace(/\\/g, '/');
    }
    static goUpOne(dir) {
        return path.resolve(dir, '..');
    }
    getInDir(sub) {
        this._log.info('method renamed, use getFilesIn');
        return this.getFilesIn(sub);
    }
    getFilesIn(sub) {
        const rec = FileHound.create() //recursive
            .paths(this.dir + sub)
            .findSync();
        let ret = []; //empty string array
        const ll = this.dir.length + sub.length;
        for (let s of rec) { //clean the strings
            let n = s.substr(ll);
            ret.push(n);
        }
        return ret;
    }
    /**
     * Get list of dirs w/o root part
     */
    getShort() {
        let lst = this.getFolders();
        let ret = []; //empty string array
        const ll = this.dir.length;
        for (let s of lst) { //clean the strings
            let n = s.substr(ll);
            //log.(n)
            ret.push(n);
        }
        return ret;
    }
    getFolders() {
        const rec = FileHound.create() //recursive
            .paths(this.dir)
            .findSync();
        let ret = []; //empty string array
        for (let val of rec) { //clean the strings
            val = Dirs.slash(val);
            let n = val.lastIndexOf('/');
            let s = val.substring(0, n);
            ret.push(s);
        }
        return Array.from(new Set(ret));
    } //()
} //class
exports.Dirs = Dirs;
