"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../db/Utils");
const hash = require("murmurhash3js");
class MetricsHandler {
    constructor(db) {
        this._log = new TerseB(this.constructor.name);
        MetricsHandler._db = db;
    }
    // perf trace route on ip
    // percent chance of processing vs ignore by domain
    async metrics(req, resp) {
        let params = req.body;
        // ip fingers
        let ip = req.socket.remoteAddress;
        const fullDomain = params.domain;
        let domain = fullDomain.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
        let str = domain + params.fidc + ip;
        const fullFinger = hash.x64.hash128(str);
        resp.send('OK');
        try {
            // dev only XXX ***
            // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            //ip = '64.78.253.68'
            MetricsHandler._db.writeMetrics(domain, fullFinger, params, ip);
        }
        catch (err) {
            this._log.warn(err);
        }
    } //()
    error(req, resp) {
        this._log.info('error');
        let ip = req.socket.remoteAddress;
        let params = req.body;
        const fullDomain = params.domain;
        let domain = Utils_1.Utils.getDomain(fullDomain);
        let str = domain + params.fidc + ip;
        const fullFinger = hash.x64.hash128(str);
        let error = params.error;
        resp.send('OK');
        // dev only XXX ***
        // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        //ip = '64.78.253.68'
        if (!(MetricsHandler.isJSON(error)))
            MetricsHandler._db.writeError(domain, fullFinger, ip, fullDomain, error, params);
        else {
            let message = JSON.parse(error);
            this._log.info(Object.keys(message));
            MetricsHandler._db.writeError(domain, fullFinger, ip, fullDomain, message.message, params, message.mode, message.name, message.stack);
        }
    } //()
    log(req, resp) {
        this._log.info('log');
        let ip = req.socket.remoteAddress;
        let params = req.body;
        const fullDomain = params.domain;
        let domain = Utils_1.Utils.getDomain(fullDomain);
        let str = domain + params.fidc + ip;
        const fullFinger = hash.x64.hash128(str);
        console.log(params);
        resp.send('OK');
    } //()
    static isJSON(str) {
        try {
            JSON.parse(str);
            return true;
        }
        catch (e) {
            return false;
        }
    } //()
} //class
exports.MetricsHandler = MetricsHandler;
