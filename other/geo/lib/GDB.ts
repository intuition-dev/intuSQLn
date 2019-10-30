
const bunyan = require('bunyan')
const log = bunyan.createLogger({src: true, name: "class name"})

import { BaseDBL } from 'mbake/lib/BaseDBL'

const ipInt = require('ip-to-int')

const perfy = require('perfy')

export class GDB extends BaseDBL  {

   constructor() {
      super()
      this.schema()
   }//()

   ins(p) {
      const fromInt = ipInt(p['0'])

      this.write(`INSERT INTO geo( fromInt, first, last, cont,
            cou, state, city, 
            lat, long
         )
            VALUES
         ( ?,?,?,?,
           ?,?,?,
           ?,?
         )`
         ,
         fromInt, p['0'], p['1'], p['2'],
         p['3'], p['4'], p['5'],
         p['6'], p['7']
      )
   }//()

   private schema() {
      this.defCon(process.cwd(), '/dbip.db')

      const exists = this.tableExists('mon')
      if(exists) return

      log.info('.')
      // shard is ip for now, should be geocode
      // dt_stamp is timestamp of last change in GMT
      this.write(`CREATE TABLE geo( fromInt, 
         cou, state, city,
         first, last, cont,
         lat, long
         ) `)

      this.write(`CREATE INDEX geoLook ON geo (fromInt, cou, state, city DESC)`)
    }//()

   get(ip?) {
      perfy.start('g')
      //const fromInt = ipInt(p['0'])

      const row = this.readOne(`SELECT cou, state, city FROM geo
         WHERE ? >= fromInt
         ORDER BY fromInt DESC 
         LIMIT 1
         `, 68257567 )

      log.info(row)
      let time = perfy.end('g')
      log.info(time)

      return row
   }//()

   count() {
      perfy.start('c')

      const row = this.readOne(`SELECT count(*) as count FROM geo `)
      log.info(row)

      let time = perfy.end('c')
      log.info(time)
   }

}//()
