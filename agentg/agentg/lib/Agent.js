"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SysAgent_1 = require("./SysAgent");
const SrvRPC_1 = require("http-rpc/lib/SrvRPC");
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
class Agent {
    constructor() {
        this._log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
    }
    async runSmall() {
        this._log.info('loop:');
        let params = await SysAgent_1.SysAgent.statsSmall();
        try {
        }
        catch (err) { }
        console.log(params);
        await SysAgent_1.SysAgent.wait(1400);
        this.runSmall();
    }
    async runBig() {
        this._log.info('loop:');
        let params = {};
        params = await SysAgent_1.SysAgent.statsBig();
        let ports = await SysAgent_1.SysAgent.ports();
        params['ports'] = ports;
        let ps = await SysAgent_1.SysAgent.ps();
        params['ps'] = ps;
        try {
            await Agent.rpc.invoke('agent', 'agentBig', params);
        }
        catch (err) { }
        console.log(params);
        await SysAgent_1.SysAgent.wait(60 * 1000);
        this.runBig();
    }
}
exports.Agent = Agent;
Agent.rpc = new SrvRPC_1.HttpRPC('http', 'localhost', 8888);
