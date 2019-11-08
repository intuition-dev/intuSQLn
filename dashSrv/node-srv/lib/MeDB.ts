
import { BaseDBL } from 'mbake/lib/BaseDBL'

const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "Base"})

export class MeDB extends BaseDBL  {

   writeMetrics(fullFinger, params, geo) {

      log.info(params)
      
      // pk is assigned by db in this case
      this.write(`INSERT INTO met( fullFinger,  Date.now(), 

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

      // check if fullFinger exists

      // fullFinger is PK
      this.write(`INSERT INTO devices( fullFinger, Date.now()
            lat, long, cou, sub, post, aso, proxy,

            
      `
      )

   }//()

   constructor() {
      super()

      //this.schema()
   }//()

   private schema() {
      this.defCon(process.cwd(), './lib/met.db')

      const exists = this.tableExists('met')
      if(exists) return

      log.info('.')
      // shard is ip for now, should be geocode
      // dt_stamp is timestamp of last change in GMT
      this.write(`CREATE TABLE met( guid, geoLocation, orgCode, ip,
         fid, lang, userAgent, referrer,
         h, w, url,
         idleTime, domTime, startTime 

         dt_stamp DATETIME) `)

      this.write(`CREATE INDEX mon_dt_stamp ON mon (host, dt_stamp DESC)`)
    }

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
