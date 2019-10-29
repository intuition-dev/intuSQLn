const csv = require('csv-parser');
const fs = require('fs');
var perfy = require('perfy');
const csvFile = 'dbip.csv';
perfy.start('pa');
fs.createReadStream(csvFile)
    .pipe(csv())
    .on('data', (data) => {
    console.log(data);
});
