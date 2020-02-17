import { BaseDBL } from 'mbakex/lib/BaseDBL'

import { DateTime } from 'luxon'

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

// SEO

export class MeDB extends BaseDBL  {

   log = bunyan.createLogger({src: true, stream: formatOut, name: this.constructor.name })

 
   constructor() {
      super()

      this.schema()
   }//()

   private _getPriorDateTimeDiff(fullFinger, curDate) { 
      const rows = this.read(`SELECT dateTime FROM met
         WHERE fullFinger = ?
         ORDER BY rowid DESC 
         LIMIT 1
         `, fullFinger)
      
      this.log.info(rows)
      const row = rows[0]
      const delta = ( Date.parse(curDate) - Date.parse(row['dateTime']) )
      this.log.info(delta)
      return delta 
   }//()

   async writeMetrics(domain, fullFinger, params, ip) {
      const date = DateTime.local().toString()

      // sameDomain
      let referrerLocalFlag:number = 0


      let priorDateTimeDiff:number = this._getPriorDateTimeDiff(fullFinger, date)

      this.log.info(priorDateTimeDiff)
      
      // pk is assigned by db in this case
      // priorDateTimeDiff is how long since the last load page event - look for last record. Max for never
      
      this.write(`INSERT INTO met( fullFinger, dateTime, 
         url, title, referrer, domTime,
         referrerLocalFlag, priorDateTimeDiff )
            VALUES
         ( ?,?,
          ?,?,?,?,
          ?,?
         )`
         ,
         fullFinger, date, 
         params.domain, params.title, params.referrer, params.domTime,
         referrerLocalFlag, priorDateTimeDiff
      )
      this.log.info('met')

      this.writeDevice(fullFinger, ip, params, domain, date )

   }//()

   async writeDevice(fullFinger, ip, params, domain, date ) {
   
      // check if fullFinger exists
      if(MeDB._fingeExists(fullFinger, this))
      return
      
      let langCou:string = null
      try {
         if(params.lang.includes('-')) {
            let pos:number = params.lang.indexOf('-')
            langCou = params.lang.substring(pos)
         }
      } catch (err) {
         this.log.err(err)
      }
      // fullFinger is PK
      this.write(`INSERT INTO device( domain, fullFinger, ip,
         lat, long, geoTz,  cou, cou2, sub,  state, city, 
         city2, post, aso,  proxy,
         bro, os, mobile, tz, lang, langCou, ie, 
         hw, dateTime)
            VALUES
      ( ?, ?, ?,
       ?,?,?, ?,?,?, ?,?,
       ?,?,?, ?,
       ?,?,?, ?,?,?,?,
       ?,?
      )`
      ,
      domain, fullFinger, ip, 
     
     )//
     this.log.info('dev')

      
   }//()


   static _fingeExists(fullFinger, ctx:BaseDBL) {
      const rows = ctx.read(`SELECT fullFinger FROM device
         WHERE fullFinger = ?
         LIMIT 1
         `, fullFinger)
      if((!rows) || rows.length!=1 )
         return false
      return true
   }//()

   private schema() {
      this.defCon(process.cwd(), '/met.db')

      const exists = this.tableExists('met')
      this.log.info('schema', exists)

      if(exists) return
  
      this.write(` CREATE TABLE error( domain, dateTime TEXT, fullFinger, ip TEXT, url, message TEXT, mode TEXT, name TEXT, stack TEXT
      ) `)
      this.write(`CREATE INDEX i_error ON error(domain, fullFinger, dateTime DESC)`)

      this.write(`CREATE TABLE met(  fullFinger TEXT, dateTime TEXT, 
            url, title, referrer, domTime, 
            referrerLocalFlag INTEGER, priorDateTimeDiff INT
         ) `)
      this.write(`CREATE INDEX i_met ON met (dateTime DESC)`)
         
      this.write(`CREATE TABLE device( domain, fullFinger TEXT NOT NULL PRIMARY KEY, ip TEXT,
            lat, long, geoTz, cou, cou2, sub, state, city, city2, post, aso, proxy INTEGER,
            bro, os, mobile INTEGER, tz, lang, langCou, ie INTEGER, 
            hw, dateTime TEXT
         ) WITHOUT ROWID `)
      this.write(`CREATE INDEX i_device ON device(domain, fullFinger, dateTime DESC)`)

      this.log.info('schemaDone')

    }//()




}//()