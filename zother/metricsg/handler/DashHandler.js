"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("http-rpc/lib/Serv");
const terse_b_1 = require("terse-b/terse-b");
class DashHandler extends Serv_1.BaseRPCMethodHandler {
    constructor(mdb) {
        super(1);
        this.log = new terse_b_1.TerseB(this.constructor.name);
        this.mdb = mdb;
    }
    async pageViews(params) {
        this.log.info(params);
        let ret = this.mdb.dashPageViews('www.ubaycap.com');
        return ret;
    } //()
    async popular(params) {
        this.log.info(params);
        let ret = this.mdb.dashPgPopular('www.ubaycap.com');
        return ret;
    } //()
    async ref(params) {
        this.log.info(params);
        let ret = this.mdb.dashRef('www.ubaycap.com');
        return ret;
    } //()
    async geo(params) {
        this.log.info(params);
        let ret = this.mdb.dashGeo('www.ubaycap.com');
        return ret;
    } //()
    async recent(params) {
        this.log.info(params);
        let ret = this.mdb.dashRecentUsers('www.ubaycap.com');
        return ret;
    } //() 
} //class
exports.DashHandler = DashHandler;
