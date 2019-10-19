
var logger = require('tracer').console()
const os = require('os')

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

   showLast(host?) {

      let rows = this.read(`SELECT datetime(dt_stamp, 'localtime') as local, * FROM mon
         ORDER BY host, dt_stamp DESC 
         LIMIT 3
         `)

      logger.trace(rows)
   }




   countMon() {
      const row = this.readOne(`SELECT count(*) as count FROM mon `)
      logger.trace(row)
   }

   memory() {
      const row = this.readOne(`SELECT sqlite3_memory_used()`)
      logger.trace(row)
   }


}//()
