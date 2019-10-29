"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const log = bunyan.createLogger({ src: true, name: "geoapp" });
const GDB_1 = require("./GDB");
const csv = require('csv-parser');
const fs = require('fs');
var perfy = require('perfy');
const csvFile = 'dbip.csv';
const db = new GDB_1.GDB();
class Load {
    import() {
        perfy.start('imp');
        fs.createReadStream(csvFile)
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
            db.ins(row);
        })
            .on('end', () => {
            let time = perfy.end('imp');
            log.info(time);
        });
    }
}
exports.Load = Load;
