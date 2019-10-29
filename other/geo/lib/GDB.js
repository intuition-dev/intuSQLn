"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const log = bunyan.createLogger({ src: true, name: "class name" });
const BaseDBL_1 = require("mbake/lib/BaseDBL");
class GDB extends BaseDBL_1.BaseDBL {
    constructor() {
        super();
        this.schema();
    }
    schema() {
        this.defCon(process.cwd(), '/dpip.db');
        const exists = this.tableExists('mon');
        if (exists)
            return;
        log.info('.');
        this.write(`CREATE TABLE geo( first, last, cont,
         cou, state, city,
         lat, long
         ) `);
    }
    ins(p) {
        this.write(`INSERT INTO geo( first, last, cont,
            cou, state, city, 
            lat, long
         )
            VALUES
         ( ?,?,?,
           ?,?,?,
           ?,?
         )`, p['0'], p['1'], p['2'], p['3'], p['4'], p['5'], p['6'], p['7']);
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
}
exports.GDB = GDB;
