"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("http-rpc/lib/Serv");
class DashHandler extends Serv_1.BaseRPCMethodHandler {
    constructor(db) {
        super(1);
        this.db = db;
    }
    async agentSmall(params) {
        const ip = params.remoteAddress;
        console.log(params);
        await this.db.writeData(params);
        return "OK";
    } //()
    agentBig(params) {
        const ip = params.remoteAddress;
        //console.log(params)
        return "OK";
    } //()
} //class
exports.DashHandler = DashHandler;
