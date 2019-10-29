

const bunyan = require('bunyan')
const log = bunyan.createLogger({src: true, name: "geoapp"})

import { GDB } from './GDB'


const csv = require('csv-parser')
const fs = require('fs')

var perfy = require('perfy')

const csvFile = 'dbip.csv'

const db = new GDB()

export class Load {

import() {
   perfy.start('imp')
   fs.createReadStream(csvFile)
   .pipe(csv({headers:false}))
   .on('data', (row) => {
         db.ins(row)
   })
   .on('end', () => {
      let time = perfy.end('imp')
      log.info(time)
   })

}//()

}//class