
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
      this.write(`INSERT INTO met( fullFinger, dateTime, orgCode,
         url, referrer, domTime, idleTime,
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
      this.write(`INSERT INTO device( fullFinger, ip,
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
            fullFinger, ip, 
            geo.lat, geo.long, geo.cou, geo.sub, geo.post, geo.aso, geo.proxy,
            params.

      )//

   }//()
   private schema() {

      // SEO
      this.defCon(process.cwd(), '/db/met.db')

      const exists = this.tableExists('met')
      if(exists) return
      log.info('schema')

      this.write(`CREATE TABLE met( fullFinger TEXT, dateTime DATETIME, orgCode
            url, referrer, domTime, idleTime
            referrerLocalFlag, priorDateTimeDiff INT
         ) `)
      this.write(`CREATE TABLE device( fullFinger TEXT NOT NULL PRIMARY KEY, ip TEXT,
            lat, long, cou, sub, post, aso, proxy,
            bro, os, mobile, tz, lang, ie, 
            h, w, dateTime DATETIME
         ) WITHOUT ROWID `)


      this.write(`CREATE INDEX met_dt ON met (fullFinger, dateTime DESC, domTime, idleTime)`)
    }//()

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

      this.schema()
   }//()

   showRecentUsers(orgCode, cou) {
      const rows = this.read(`SELECT DISTINCT fullFinger FROM met
         ORDER BY dateTime DESC 
         LIMIT 60
         `)
      // for each finger, get metrics and country


   }//()

   showPerf(){ // average performance groped by time and country

   }

   showMap(){}
   showRef(){}
   showRUMPath(){}
   showRPM(){}

}//()
