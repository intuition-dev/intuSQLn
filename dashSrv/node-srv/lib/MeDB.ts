
import { BaseDBL } from 'mbake/lib/BaseDBL'

const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "Base"})

export class MeDB extends BaseDBL  {

   static MAXINT:number = 9223372036854775807 

   _getPriorDateTimeDiff(fullFinger, curDate) {
      const rows = this.read(`SELECT dateTime FROM met
         WHERE fullFinger = ?
         ORDER BY dateTime DESC 
         LIMIT 1
         `, fullFinger)
      if((!rows) || rows.length!=1 )
         return MeDB.MAXINT

      const row = rows[0]
      const delta = ( Date.parse(curDate) - row['dateTime']  ) / 1000
      return delta 
   }//()

   writeMetrics(fullFinger, params, ip, geo) {
      const date = new Date().toISOString()

      log.info(params)
      
      let referrerLocalFlag:boolean
      let priorDateTimeDiff:number

      // pk is assigned by db in this case
      // priorDateTimeDiff is how long since the last load page event - look for last record. Max for never
      this.write(`INSERT INTO met(  fullFinger, dateTime, orgCode
         url, referrer, domTime, idleTime
         referrerLocalFlag, priorDateTimeDiff )
            VALUES
         ( ?,?,?,
          ?,?,?,?,
          ?,?
         )`
         ,
         fullFinger, date, params.orgCode,
         params.url, params.referre, params.domTime, params.idleTime,
         referrerLocalFlag, priorDateTimeDiff
      )

      // check if fullFinger exists

      // fullFinger is PK
      this.write(`INSERT INTO devices( fullFinger, ip,
            lat, long, cou, sub, post, aso, proxy,
            bro, os, mobile, tz, lang, ie, 
            h, w, dateTime)
               VALUES
         ( ?, ?,
          ?,?,?, ?,?,?,?,
          ?,?,?, ?,?,?,
          ?,?,?
         )`
         ,
      )//

   }//()
   private schema() {
      this.defCon(process.cwd(), './lib/met.db')

      const exists = this.tableExists('met')
      if(exists) return
      log.info('.')

      this.write(`CREATE TABLE met( fullFinger, dateTime DATETIME, orgCode
            url, referrer, domTime, idleTime
            referrerLocalFlag, priorDateTimeDiff
         ) `)

      this.write(`CREATE TABLE devices( fullFinger, ip,
            lat, long, cou, sub, post, aso, proxy,
            bro, os, mobile, tz, lang, ie, 
            h, w, dateTime DATETIME
         ) `)


      this.write(`CREATE INDEX mon_dt_stamp ON mon (host, dt_stamp DESC)`)

    }

   _fingeExists(fullFinger) {
      const rows = this.read(`SELECT fullFinger FROM devices
         WHERE fullFinger = ?
         LIMIT 1
         `, fullFinger)
      if((!rows) || rows.length!=1 )
         return false
      return true
   }//()


   constructor() {
      super()

      //this.schema()
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

}//()
