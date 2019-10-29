"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: "geoapp" });
const csv = require('csv-parser');
const fs = require('fs');
var perfy = require('perfy');
const csvFile = 'dbip.csv';
class Load {
    start() {
        perfy.start('pa');
        fs.createReadStream(csvFile)
            .pipe(csv())
            .on('data', (data) => {
            console.log(data);
        });
    }
}
exports.Load = Load;
