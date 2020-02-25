"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../db/Utils");
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const hash = require("murmurhash3js");
class MetricsHandler {
    constructor(db) {
        this._log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
        MetricsHandler._db = db;
    }
    async metrics(req, resp) {
        let params = req.body;
        let ip = req.connection.remoteAddress;
        const fullDomain = params.domain;
        let domain = fullDomain.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
        let str = domain + params.fidc + ip;
        const fullFinger = hash.x64.hash128(str);
        resp.send('OK');
        try {
            MetricsHandler._db.writeMetrics(domain, fullFinger, params, ip);
        }
        catch (err) {
            this._log.warn(err);
        }
    }
    error(req, resp) {
        this._log.info('error');
        let ip = req.connection.remoteAddress;
        let params = req.body;
        const fullDomain = params.domain;
        let domain = Utils_1.Utils.getDomain(fullDomain);
        let str = domain + params.fidc + ip;
        const fullFinger = hash.x64.hash128(str);
        let error = params.error;
        resp.send('OK');
        if (!(MetricsHandler.isJSON(error)))
            MetricsHandler._db.writeError(domain, fullFinger, ip, fullDomain, error, params);
        else {
            let message = JSON.parse(error);
            this._log.info(Object.keys(message));
            MetricsHandler._db.writeError(domain, fullFinger, ip, fullDomain, message.message, params, message.mode, message.name, message.stack);
        }
    }
    log(req, resp) {
        this._log.info('log');
        let ip = req.connection.remoteAddress;
        let params = req.body;
        const fullDomain = params.domain;
        let domain = Utils_1.Utils.getDomain(fullDomain);
        let str = domain + params.fidc + ip;
        const fullFinger = hash.x64.hash128(str);
        console.log(params);
        resp.send('OK');
    }
    static isJSON(str) {
        try {
            JSON.parse(str);
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
exports.MetricsHandler = MetricsHandler;
