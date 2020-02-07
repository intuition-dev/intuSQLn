"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SysAgent_1 = require("mbake/lib/SysAgent");
const Invoke_1 = require("mbake/lib/Invoke");
var logger = require('tracer').console();
class Agent {
    async run() {
        logger.trace('loop:');
        await Agent.rpc.invoke('monitor', 'monitor', await SysAgent_1.SysAgent.stats());
        await SysAgent_1.SysAgent.wait(200);
        this.run();
    }
}
exports.Agent = Agent;
Agent.rpc = new Invoke_1.HttpRPC('http', 'localhost', 8888);
