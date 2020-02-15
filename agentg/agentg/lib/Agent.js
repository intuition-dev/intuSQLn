"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SysAgent_1 = require("./SysAgent");
const Invoke_1 = require("http-rpc/lib/Invoke");
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
class Agent {
    constructor() {
        this._log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
    }
    async run() {
        this._log.info('loop:');
        let params = await SysAgent_1.SysAgent.stats();
        this._log.info(params);
        await SysAgent_1.SysAgent.wait(200);
        this.run();
    }
}
exports.Agent = Agent;
Agent.rpc = new Invoke_1.HttpRPC('http', 'localhost', 8888);
