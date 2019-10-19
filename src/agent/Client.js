"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SysAgent_1 = require("mbake/lib/SysAgent");
const Invoke_1 = require("mbake/lib/Invoke");
var logger = require('tracer').console();
class Client {
    async foo() {
        logger.trace('loop:');
        await Client.rpc.invoke('monitor', 'monitor', 'monitor', await SysAgent_1.SysAgent.ping());
        await SysAgent_1.SysAgent.wait(200);
        this.foo();
    }
}
exports.Client = Client;
Client.rpc = new Invoke_1.HttpRPC('http', 'localhost', 8888);
