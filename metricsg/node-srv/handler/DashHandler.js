"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("http-rpc/lib/Serv");
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
class DashHandler extends Serv_1.BaseRPCMethodHandler {
    constructor(mdb) {
        super(1);
        this.log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
        this.mdb = mdb;
    }
    async pageViews(params) {
        this.log.info(params);
        let ret = this.mdb.dashPageViews('www.ubaycap.com');
        return ret;
    }
    async popular(params) {
        this.log.info(params);
        let ret = this.mdb.dashPgPopular('www.ubaycap.com');
        return ret;
    }
    async ref(params) {
        this.log.info(params);
        let ret = this.mdb.dashRef('www.ubaycap.com');
        return ret;
    }
    async geo(params) {
        this.log.info(params);
        let ret = this.mdb.dashGeo('www.ubaycap.com');
        return ret;
    }
    async recent(params) {
        this.log.info(params);
        let ret = this.mdb.dashRecentUsers('www.ubaycap.com');
        return ret;
    }
}
exports.DashHandler = DashHandler;
