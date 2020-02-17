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
        let ports = await SysAgent_1.SysAgent.ports();
        params['ports'] = ports;
        let ps = await SysAgent_1.SysAgent.ps();
        params['ps'] = ps;
        await Agent.rpc.invoke('agent', 'agent', 'agent', params);
        await SysAgent_1.SysAgent.wait(1400);
    }
}
exports.Agent = Agent;
Agent.rpc = new Invoke_1.HttpRPC('http', 'localhost', 8888);
