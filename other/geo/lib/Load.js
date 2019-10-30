"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const log = bunyan.createLogger({ src: true, name: "geoapp" });
const GDB_1 = require("./GDB");
const csv = require('csv-parser');
const fs = require('fs');
const perfy = require('perfy');
const csvFile = 'dbip.csv';
const db = new GDB_1.GDB();
class Load {
    async import() {
        perfy.start('imp');
        fs.createReadStream(csvFile)
            .pipe(csv({ headers: false }))
            .on('data', async (row) => {
            await db.ins(row);
        })
            .on('end', () => {
            let time = perfy.end('imp');
            console.log(':i:');
            log.info(time);
        });
        await db.count();
        await db.get();
    }
}
exports.Load = Load;
