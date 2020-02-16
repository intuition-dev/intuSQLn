
const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

const csv = require('csv-parser')
const fs = require('fs-extra')


import { BaseDBL } from 'mbakex/lib/BaseDBL'

const ip = require('ip') //

const perfy = require('perfy')

export class GDB extends BaseDBL  {

   log = bunyan.createLogger({src: true, stream: formatOut, name: this.constructor.name })

   constructor() {
      super()
      this.schema()
   }//()


   _ins(p) {
      let fromInt:number 
      let toInt:number 

      try {
         fromInt = ip.toLong(p['0'])
         toInt = ip.toLong(p['1'])

      } catch(err) {
         console.log(p['0'])
         fromInt = 0
      }

      this.write(`INSERT INTO geo( fromInt, toInt, first, last, cont,
            cou, state, city, 
            lat, long
         )
            VALUES
         ( ?,?,?,?,?,
           ?,?,?,
           ?,?
         )`
         ,
         fromInt, toInt, p['0'], p['1'], p['2'],
         p['3'], p['4'], p['5'],
         p['6'], p['7']
      )
   }//()

async load() {
   perfy.start('imp')

   const csvFile = './gdb/dbip-city-lite-2020-01.csv'
   const THIZ = this
   await fs.createReadStream(csvFile)
   .pipe(csv({headers:false}))
   .on('data', async (row) => {
         await THIZ._ins(row)
   })
   .on('end', () => {
      let time = perfy.end('imp')
      console.log(':i:')
      this.log.info(time)

      this.get('64.78.253.68')

   })
}//()

   private async schema() {
      this.defCon(process.cwd(), '/dbip.db')

      const exists = this.tableExists('geo')
      this.log.info(exists)
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
      this.log.info(adrs, fromInt)

      const row = this.readOne(`SELECT cou, state, city FROM geo
         WHERE ? >= fromInt
      
         ORDER BY fromInt DESC 
         LIMIT 1
         `, fromInt )

      //let time = perfy.end('g')
      console.log(row)
      return row
   }//()

}//()
