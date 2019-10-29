


const bunyan = require('bunyan');

const log = bunyan.createLogger({name: "geoapp"})


const csv = require('csv-parser')
const fs = require('fs')

var perfy = require('perfy')

const csvFile = 'dbip.csv'

export class Load {

start() {
   perfy.start('pa')
   fs.createReadStream(csvFile)
   .pipe(csv())
   .on('data', (data) => {
         //let time = perfy.end('pa')
         console.log( data)
   })
}//()

}//class