"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const checkDiskSpace = require('check-disk-space');
const psList = require('ps-list');
const find = require('find-process');
class SysAgent {
    constructor() {
        this._log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
    }
    static ps() {
        return psList();
    }
    static disk() {
        return new Promise(function (resolve, reject) {
            checkDiskSpace('/').then((diskSpace) => {
                resolve(diskSpace);
            });
        });
    }
    async ports() {
        const THIZ = this;
        let ports = [];
        await SysAgent.si.networkConnections().then(data => {
            data.forEach(function (v) {
                ports.push(v.localport);
            });
        });
        let results = [];
        let pids = {};
        for (let i = 0; i < ports.length; i++) {
            try {
                let row = await find('port', ports[i]);
                if (!row)
                    continue;
                if (row[0])
                    row = row[0];
                let pid = row['pid'];
                if (!pid)
                    continue;
                if (pids.hasOwnProperty(pid))
                    continue;
                pids[pid] = 'X';
                let ins = { port: ports[i], pid: pid, name: row['name'] };
                results.push(ins);
            }
            catch (err) {
                THIZ._log.info(err);
            }
        }
        return results;
    }
    static async statsBig() {
        const track = new Object();
        track['guid'] = SysAgent.guid();
        track['dt_stamp'] = new Date().toISOString();
        let disk = await SysAgent.disk();
        track['disk'] = disk;
        track['host'] = SysAgent.os.hostname();
        return track;
    }
    static async statsSmall() {
        const track = new Object();
        track['guid'] = SysAgent.guid();
        track['dt_stamp'] = new Date().toISOString();
        await SysAgent.si.fsStats().then(data => {
            track['fsR'] = data.rx;
            track['fsW'] = data.wx;
        });
        await SysAgent.si.disksIO().then(data => {
            track['ioR'] = data.rIO;
            track['ioW'] = data.wIO;
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
    }
    static wait(t) {
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve();
            }, t);
        });
    }
}
exports.SysAgent = SysAgent;
SysAgent.guid = require('uuid/v4');
SysAgent.si = require('systeminformation');
SysAgent.os = require('os');
