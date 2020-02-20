"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const fs = require("fs-extra");
const AdmZip = require("adm-zip");
const download = require("download");
const yaml = require("js-yaml");
const path = require("path");
const FileHound = require("filehound");
class DownloadC {
    constructor(key_, targetDir_) {
        this._log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
        this.key = key_;
        this.targetDir = targetDir_;
    }
    autoUZ() {
        const THIZ = this;
        this.getVal().then(function (url) {
            THIZ._log.info(url);
            const fn = THIZ.getFn(url);
            THIZ._log.info(fn);
            THIZ.down(url, fn).then(function () {
                THIZ.unzip(fn);
            });
        });
    }
    auto() {
        const THIZ = this;
        this.getVal().then(function (url) {
            const fn = THIZ.getFn(url);
            THIZ.down(url, fn);
        });
    }
    checkVer(lver) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ.getVal().then(function (ver) {
                if (ver == lver)
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }
    getVal() {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            download(DownloadC.truth).then(data => {
                let dic = yaml.load(data);
                resolve(dic[THIZ.key]);
            }).catch(err => {
                THIZ._log.info('err: where is the vfile?', err, DownloadC.truth);
            });
        });
    }
    getFn(url) {
        const pos = url.lastIndexOf('/');
        return url.substring(pos);
    }
    down(url, fn) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            download(url).then(data => {
                fs.writeFileSync(THIZ.targetDir + '/' + fn, data);
                THIZ._log.info('downloaded');
                resolve('OK');
            }).catch(err => {
                THIZ._log.info('err: where is the file?', err, url);
            });
        });
    }
    unzip(fn) {
        const zfn = this.targetDir + fn;
        this._log.info(zfn);
        const zip = new AdmZip(zfn);
        zip.extractAllTo(this.targetDir, true);
        fs.remove(this.targetDir + '/' + fn);
    }
}
exports.DownloadC = DownloadC;
DownloadC.truth = 'https://INTUITION-dev.github.io/mbCLI/versions.yaml';
class YamlConfig {
    constructor(fn) {
        this._log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
        let cfg = yaml.load(fs.readFileSync(fn));
        this._log.info(cfg);
        return cfg;
    }
}
exports.YamlConfig = YamlConfig;
class DownloadFrag {
    constructor(dir, ops) {
        this._log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
        this._log.info('Extracting to', dir);
        if (!ops) {
            new DownloadC('headFrag', dir).auto();
            new DownloadC('VM', dir).auto();
            new DownloadC('Tests', dir).auto();
            new DownloadC('Bind', dir).auto();
        }
        if (ops) {
            new DownloadC('opsPug', dir).auto();
            new DownloadC('opsJs', dir).auto();
        }
    }
}
exports.DownloadFrag = DownloadFrag;
class VersionNag {
    constructor() {
        this._log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
    }
    static isCurrent(prod, ver) {
        const down = new DownloadC(prod, null);
        return down.checkVer(ver);
    }
}
exports.VersionNag = VersionNag;
class Dirs {
    constructor(dir_) {
        this._log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
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
        this._log.info('method renamed use getFilesIn');
        return this.getFilesIn(sub);
    }
    getFilesIn(sub) {
        const rec = FileHound.create()
            .paths(this.dir + sub)
            .findSync();
        let ret = [];
        const ll = this.dir.length + sub.length;
        for (let s of rec) {
            let n = s.substr(ll);
            ret.push(n);
        }
        return ret;
    }
    getShort() {
        let lst = this.getFolders();
        let ret = [];
        const ll = this.dir.length;
        for (let s of lst) {
            let n = s.substr(ll);
            ret.push(n);
        }
        return ret;
    }
    getFolders() {
        const rec = FileHound.create()
            .paths(this.dir)
            .findSync();
        let ret = [];
        for (let val of rec) {
            val = Dirs.slash(val);
            let n = val.lastIndexOf('/');
            let s = val.substring(0, n);
            ret.push(s);
        }
        return Array.from(new Set(ret));
    }
}
exports.Dirs = Dirs;
module.exports = {
    DownloadFrag, YamlConfig, DownloadC, VersionNag, Dirs
};
