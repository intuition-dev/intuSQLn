"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDBS_1 = require("mbakex/lib/BaseDBS");
const terse_b_1 = require("terse-b/terse-b");
const hash = require("murmurhash3js");
class AgDB extends BaseDBS_1.BaseDBS {
    constructor() {
        super();
        this.log = new terse_b_1.TerseB(this.constructor.name);
        this.schema();
    } //()
    _getPriorTimeDiff(box_id, curDate) {
        const row = this.readOne(`SELECT dateTime FROM data
         WHERE box_id = ?
         ORDER BY dateTime DESC 
         LIMIT 1
         `, box_id);
        this.log.info(row);
        if (!row)
            return AgDB.MAXINT;
        const delta = (Date.parse(curDate) - Date.parse(row['dateTime']));
        this.log.info(delta);
        return delta;
    } //()
    _tst() {
        const row = this.tableExists('data');
        console.log(row);
        console.log(this.getBoxes());
    }
    getBoxData(boxid) {
        const rows = this.read(`SELECT * 
         FROM data
         WHERE box_id =?
         ORDER BY dateTime DESC`, boxid);
        return rows;
    }
    getBoxes() {
        const rows = this.read(`SELECT DISTINCT box_id
         FROM data`);
        return rows;
    }
    writeData(params) {
        const box_id = hash.x86.hash32(params.host + params.remoteAddress);
        let timeDif = this._getPriorTimeDiff(box_id, params.dt_stamp);
        this.log.info(params);
        try {
            this.write(`INSERT INTO data( box_id, dateTime, host, ip, timeDif,
         ioR, ioW, fsR, fsW, openMax, openAlloc,
         nicR, nicT, memFree, memUsed, swapUsed, swapFree,
         cpu, cpuIdle )
            VALUES
         (  ?,?,?, ?, ?,
            ?,?,?, ?, ?,?,
            ?,?,?, ?, ?,?,
            ?,?
         )`, box_id, params.dt_stamp, params.host, params.remoteAddress, timeDif, params.ioR, params.ioW, params.fsR, params.fsW, params.openMax, params.openAlloc, params.nicR, params.nicT, params.memFree, params.memUsed, params.swapUsed, params.swapFree, params.cpu, params.cpuIdle);
        }
        catch (err) {
            this.log.warn(err);
        }
    } //()
    schema() {
        this.defCon(process.cwd() + '/ag.db');
        const exists = this.tableExists('data');
        this.log.info('schema', exists);
        if (exists)
            return;
        this.write(`CREATE TABLE data( box_id TEXT, dateTime TEXT, host, 
         ip TEXT,  timeDif,
         ioR, ioW, fsR, fsW, openMax, openAlloc,
         nicR, nicT, memFree, memUsed, swapUsed, swapFree,
         cpu, cpuIdle
      ) `);
        this.write(`CREATE INDEX i_data ON data(box_id, dateTime DESC, cpu, memUsed, 
         nicR, nicT )`);
        this.log.info('schemaDone');
    } //()
} //()
exports.AgDB = AgDB;
AgDB.MAXINT = 9223372036854775807;
