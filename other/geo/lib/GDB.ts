
const bunyan = require('bunyan')
const log = bunyan.createLogger({src: true, name: "class name"})

import { BaseDBL } from 'mbake/lib/BaseDBL'

export class GDB extends BaseDBL  {

   constructor() {
      super()

      this.schema()
   }//()

   private schema() {
      this.defCon(process.cwd(), '/aa.db')

      const exists = this.tableExists('mon')
      if(exists) return

      log.info('.')
      // shard is ip for now, should be geocode
      // dt_stamp is timestamp of last change in GMT
      this.write(`CREATE TABLE geo( first, last, cont,
         cou, state, city, latiLong
         ) `)

    }

   ins(params) {
      //log.info(Date.now(), params)

      this.write(`INSERT INTO geo( first, last, cont,
         cou, state, city, latiLong
         )
            VALUES
         ( ?,?,?
         ?,?,?,?
         )`
         ,
         params.guid, params.ip,
         params.host,
         params.nicR, params.nicT,
         params.memFree, params.memUsed,
         params.cpu,
         params.dt_stamp 
      )

   }//()

   showLastPerSecond(host?) {

      const rows = this.read(`SELECT datetime(dt_stamp, 'localtime') as local, * FROM mon
         ORDER BY host, dt_stamp DESC 
         LIMIT 60
         `)

      const sz = rows.length

      //first pass to get seconds, min and max
      let i
      const rows2 = {}
      for(i = sz -1; i >= 0; i-- ) {
         const row = rows[i]
         let date = new Date(row['local'])
         let seconds = Math.round(date.getTime() /1000)
         
         delete row['dt_stamp']
         delete row['guid']
         delete row['shard']
         
         rows2[seconds]=row
      }//for

      //log.info(rows2)
      return rows2
   }//()

   countMon() {
      const row = this.readOne(`SELECT count(*) as count FROM mon `)
      log.info(row)
   }


}//()
