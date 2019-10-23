"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
var logger = require('tracer').console();
class DashHandler extends Serv_1.BaseRPCMethodHandler {
    constructor(mdb) {
        super();
    }
    dash(resp, params) {
        logger.trace(params);
        let ret = this.mdb.showLastPerSecond();
        this.ret(resp, ret, null, null);
    }
}
exports.DashHandler = DashHandler;
