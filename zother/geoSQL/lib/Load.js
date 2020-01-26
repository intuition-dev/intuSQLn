"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "geoapp" });
const GDB_1 = require("./GDB");
const csv = require('csv-parser');
const fs = require('fs-extra');
const perfy = require('perfy');
const csvFile = 'dbip-city-lite-2020-01.csv';
const db = new GDB_1.GDB();
class Load {
    async import() {
        perfy.start('imp');
        await fs.createReadStream(csvFile)
            .pipe(csv({ headers: false }))
            .on('data', async (row) => {
            await db.ins(row);
        })
            .on('end', () => {
            let time = perfy.end('imp');
            console.log(':i:');
            log.info(time);
            this.check();
        });
    }
    async check() {
        await db.get('192.0.66.88');
    }
}
exports.Load = Load;
