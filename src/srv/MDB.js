"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger = require('tracer').console();
const os = require('os');
var logger = require('tracer').console();
const sqlite3 = require('sqlite3').verbose();
const BaseDBL_1 = require("mbake/lib/BaseDBL");
class MDB extends BaseDBL_1.BaseDBL {
    constructor() {
        super(process.cwd(), '/XXX.db');
        this.con();
    }
    async schema() {
        await this._run(this.db.prepare(`CREATE TABLE mon( guid, shard, 
            host, 
            nicR, nicT,
            memFree, memUsed,
            cpu,            
            dt_stamp DATETIME) `));
        await this._run(this.db.prepare(`CREATE INDEX mon_dt_stamp ON mon (dt_stamp DESC, host)`));
    }
    async ins(params) {
        let stmt = this.db.prepare(`INSERT INTO mon( guid, shard, 
            host, 
            nicR, nicT,
            memFree, memUsed,
            cpu,            
            dt_stamp) 
                VALUES
            ( ?,?,
            ?,?,?,
            ?,?,?,
            ? )`);
        await this._run(stmt, params.guid, params.ip, params.host, params.nicR, params.nicT, params.memFree, params.memUsed, params.cpu, params.dt_stamp);
        const qry = this.db.prepare(`SELECT datetime(dt_stamp, 'localtime') as local, * FROM mon
            ORDER BY dt_stamp DESC `);
        const rows = await this._qry(qry);
        logger.trace(rows);
    }
    async memory() {
        const qry = this.db.prepare(`SELECT sqlite3_memory_used()`);
        const rows = await this._qry(qry);
        logger.trace(rows);
    }
    checkNode() {
        logger.trace(os.freemem(), os.totalmem());
    }
}
exports.MDB = MDB;
