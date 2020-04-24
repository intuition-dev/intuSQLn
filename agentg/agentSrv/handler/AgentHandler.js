"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("http-rpc/lib/Serv");
class AgentHandler extends Serv_1.BaseRPCMethodHandler {
    constructor(db) {
        super(1);
        this.db = db;
    }
    async agentSmall(params) {
        const ip = params.remoteAddress;
        await this.db.writeData(params);
        return ["123", "OK"];
    } //()
    agentBig(params) {
        const ip = params.remoteAddress;
        return ["123", "OK"];
    } //()
} //class
exports.AgentHandler = AgentHandler;
