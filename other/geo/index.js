"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const csv = require('csv-parser');
const fs = require('fs');
var perfy = require('perfy');
const csvFile = 'dbip.csv';
async function one() {
    const jsonArray = await csv().fromFile(csvFile);
}
perfy.start('pa');
fs.createReadStream(csvFile)
    .pipe(csv())
    .on('data', (data) => {
    let time = perfy.end('pa');
    console.log(data, time);
});
