"use strict";
// Auth & Auth App
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("http-rpc/lib/Serv");
class AAA extends Serv_1.Serv {
    constructor(origins) {
        super(origins, 4 * 1024);
        const ha = new EditorHandler(this.db, this.configIntu);
        this.routeRPC('aaAPI', ha);
        this.serveStatic('webApp', null, null);
        this.listen(8080);
    }
}
exports.AAA = AAA;
