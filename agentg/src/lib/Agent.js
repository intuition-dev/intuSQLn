"use strict";
// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
Object.defineProperty(exports, "__esModule", { value: true });
const SysAgent_1 = require("./SysAgent");
const SrvRPC_1 = require("http-rpc/lib/SrvRPC");
const FileOpsExtra_1 = require("./FileOpsExtra");
const terse_b_1 = require("terse-b/terse-b");
class Agent {
    constructor() {
        this._log = new terse_b_1.TerseB(this.constructor.name);
        this.config = new FileOpsExtra_1.YamlConfig(process.cwd() + '/agentg.yaml');
        Agent.rpc = new SrvRPC_1.HttpRPC(this.config['proto'], this.config['host'], this.config['port']);
    }
    async runSmall() {
        this._log.info('loop: S');
        let params = await SysAgent_1.SysAgent.statsSmall();
        try {
            await Agent.rpc.invoke('agent', 'agentSmall', params);
        }
        catch (err) {
            this._log.warn(err);
        }
        console.log(params);
        await SysAgent_1.SysAgent.wait(1400);
        this.runSmall();
    }
    async runBig() {
        this._log.info('loop: B');
        let params = {};
        params = await SysAgent_1.SysAgent.statsBig();
        let ports = await new SysAgent_1.SysAgent().ports();
        params['ports'] = ports;
        let ps = await SysAgent_1.SysAgent.ps();
        params['ps'] = ps;
        try {
            await Agent.rpc.invoke('agent', 'agentBig', params);
        }
        catch (err) {
            this._log.warn(err);
        }
        console.log(params);
        await SysAgent_1.SysAgent.wait(20 * 1000);
        this.runBig();
    }
}
exports.Agent = Agent;
