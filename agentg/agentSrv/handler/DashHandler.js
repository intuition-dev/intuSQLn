"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("http-rpc/lib/Serv");
class DashHandler extends Serv_1.BaseRPCMethodHandler {
    constructor(db) {
        super(1);
        this.db = db;
    }
    async getBoxes(params) {
        console.log(params);
        return await ["123", this.db.getBoxes()];
    } //()
    async getBoxData(params) {
        console.log(params);
        let box_id = params.box_id;
        return await ["123", this.db.getBoxData(box_id)];
    } //()
} //class
exports.DashHandler = DashHandler;
