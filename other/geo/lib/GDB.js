"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: "class name" });
const BaseDBL_1 = require("mbake/lib/BaseDBL");
class DB extends BaseDBL_1.BaseDBL {
    constructor() {
        super();
        this.schema();
    }
    schema() {
        this.defCon(process.cwd(), '/aa.db');
        const exists = this.tableExists('mon');
        if (exists)
            return;
        log.info('.');
        this.write(`CREATE TABLE mon( guid, shard, 
         host, 
         nicR, nicT,
         memFree, memUsed,
         cpu,            
         dt_stamp DATETIME) `);
        this.write(`CREATE INDEX mon_dt_stamp ON mon (host, dt_stamp DESC)`);
    }
    ins(params) {
        this.write(`INSERT INTO mon( guid, shard, 
         host, 
         nicR, nicT,
         memFree, memUsed,
         cpu,            
         dt_stamp) 
               VALUES
         ( ?,?,
         ?,?,?,
         ?,?,?,
         ? )`, params.guid, params.ip, params.host, params.nicR, params.nicT, params.memFree, params.memUsed, params.cpu, params.dt_stamp);
    }
    showLastPerSecond(host) {
        const rows = this.read(`SELECT datetime(dt_stamp, 'localtime') as local, * FROM mon
         ORDER BY host, dt_stamp DESC 
         LIMIT 60
         `);
        const sz = rows.length;
        let i;
        const rows2 = {};
        for (i = sz - 1; i >= 0; i--) {
            const row = rows[i];
            let date = new Date(row['local']);
            let seconds = Math.round(date.getTime() / 1000);
            delete row['dt_stamp'];
            delete row['guid'];
            delete row['shard'];
            rows2[seconds] = row;
        }
        return rows2;
    }
    countMon() {
        const row = this.readOne(`SELECT count(*) as count FROM mon `);
        log.info(row);
    }
    memory() {
        const row = this.readOne(`SELECT sqlite3_memory_used()`);
        log.info(row);
    }
}
exports.DB = DB;
