"use strict";
// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const checkDiskSpace = require('check-disk-space');
const psList = require('ps-list');
class SysAgent {
    constructor() {
        this._log = new terse_b_1.TerseB(this.constructor.name);
    }
    /*
    list of running processes
    */
    static ps() {
        return psList();
    }
    static disk() {
        return new Promise(function (resolve, reject) {
            checkDiskSpace('/').then((diskSpace) => {
                resolve(diskSpace);
            });
        });
    } //()
    static async mem() {
        let track = {};
        await SysAgent.si.mem().then(data => {
            track['memFree'] = data.free;
            track['memUsed'] = data.used;
            track['swapUsed'] = data.swapused;
            track['swapFree'] = data.swapfree;
        });
        return track;
    }
    async ports() {
        const THIZ = this;
        let ports = [];
        await SysAgent.si.networkConnections().then(data => {
            data.forEach(function (v) {
                //THIZ._log.info(v)            
                let row = {};
                row['port'] = v.localport;
                row['pid'] = v.pid;
                row['name'] = v.process;
                ports.push(row);
            });
        });
        let dupes = {};
        let result = [];
        for (let i = 0; i < ports.length; i++) {
            if (dupes.hasOwnProperty(ports[i].port))
                continue;
            dupes[ports[i].port] = ports[i].port;
            result.push(ports[i]);
        }
        return result;
    } //()
    static async statsBig() {
        const track = new Object();
        track['guid'] = SysAgent.guid();
        track['dt_stamp'] = new Date().toISOString();
        track['host'] = SysAgent.os.hostname();
        let disk = await SysAgent.disk();
        track['disk'] = disk;
        return track;
    } //()
    static async statsSmall() {
        const track = new Object();
        track['guid'] = SysAgent.guid();
        track['host'] = SysAgent.os.hostname();
        track['dt_stamp'] = new Date().toISOString();
        await SysAgent.si.disksIO().then(data => {
            track['ioR'] = data.rIO;
            track['ioW'] = data.wIO;
        });
        await SysAgent.si.fsStats().then(data => {
            track['fsR'] = data.rx;
            track['fsW'] = data.wx;
        });
        await SysAgent.si.fsOpenFiles().then(data => {
            track['openMax'] = data.max;
            track['openAlloc'] = data.allocated;
        });
        let nic;
        await SysAgent.si.networkInterfaceDefault().then(data => {
            nic = data;
        });
        await SysAgent.si.networkStats(nic).then(function (data) {
            const dat = data[0];
            track['nicR'] = dat.rx_bytes;
            track['nicT'] = dat.tx_bytes;
        });
        await SysAgent.si.mem().then(data => {
            track['memFree'] = data.free;
            track['memUsed'] = data.used;
            track['swapUsed'] = data.swapused;
            track['swapFree'] = data.swapfree;
        });
        await SysAgent.si.currentLoad().then(data => {
            track['cpu'] = data.currentload;
            track['cpuIdle'] = data.currentload_idle;
        });
        return track;
    } //()
    static wait(t) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, t);
        });
    } //()
} //class
exports.SysAgent = SysAgent;
SysAgent.guid = require('uuid/v4');
SysAgent.si = require('systeminformation');
SysAgent.os = require('os');
