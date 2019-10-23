
var logger = require('tracer').console()

import { BaseDBL } from 'mbake/lib/BaseDBL'

export class MDB extends BaseDBL  {

   constructor() {
      super()

      this.schema()
   }//()

   schema() {
      this.defCon(process.cwd(), '/mon.db')

      const exists = this.tableExists('mon')
      if(exists) return

      logger.trace('.')
      // shard is ip for now, should be geocode
      // dt_stamp is timestamp of last change in GMT
      this.write(`CREATE TABLE mon( guid, shard, 
         host, 
         nicR, nicT,
         memFree, memUsed,
         cpu,            
         dt_stamp DATETIME) `)

      this.write(`CREATE INDEX mon_dt_stamp ON mon (host, dt_stamp DESC)`)
    }

   ins(params) {
      //logger.trace(Date.now(), params)

      this.write(`INSERT INTO mon( guid, shard, 
         host, 
         nicR, nicT,
         memFree, memUsed,
         cpu,            
         dt_stamp) 
               VALUES
         ( ?,?,
         ?,?,?,
         ?,?,?,
         ? )`
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
         LIMIT 5
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
         
         rows2['seconds']=row
      }//for

      //logger.trace(rows2)
      return rows2
   }//()

   countMon() {
      const row = this.readOne(`SELECT count(*) as count FROM mon `)
      logger.trace(row)
   }

   memory() {
      const row = this.readOne(`SELECT sqlite3_memory_used()`)
      logger.trace(row)
   }


}//()
