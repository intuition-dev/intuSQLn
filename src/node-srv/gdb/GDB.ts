
const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

import { BaseDBL } from 'mbakex/lib/BaseDBL'

const ip = require('ip') //

const perfy = require('perfy')

export class GDB extends BaseDBL  {

   log = bunyan.createLogger({src: true, stream: formatOut, name: this.constructor.name })

   constructor() {
      super()
      this.schema()
   }//()

   private schema() {
      this.defCon(process.cwd(), './gdb/dbip.db')

      const exists = this.tableExists('geo')
      if(exists) return

      this.log.info('.')
      this.write(`CREATE TABLE geo( fromInt, toInt,
         cou, state, city,
         first, last, cont,
         lat, long
         ) `)

      this.write(`CREATE INDEX geoLook ON geo (fromInt, toInt, cou, state, city DESC)`)
    }//()

   get(adrs) {
      const fromInt = ip.toLong(adrs)
      
      console.log(adrs, fromInt)

      const row = this.readOne(`SELECT cou, state, city FROM geo
         WHERE ? >= fromInt
      
         ORDER BY fromInt DESC 
         LIMIT 1
         `, fromInt )

      console.log(':r:')
      console.log(row)
      let time = perfy.end('g')
      
      return row
   }//()

}//()
