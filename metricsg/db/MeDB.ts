import { BaseDBS } from 'mbakex/lib/BaseDBS'
import { Geo } from '../gdb/Geo'
import { Utils } from './Utils'
import { DateTime } from 'luxon'

import { TerseB } from "terse-b/terse-b"

// SEO

export class MeDB extends BaseDBS  {

   log:any = new TerseB(this.constructor.name)

   static MAXINT:number = 9223372036854775807 
   static _geo:Geo

   constructor() {
      super()
      MeDB._geo = new Geo()

      this.schema()
   }//()

   private _getPriorDateTimeDiff(fullFinger, curDate) { 
      const rows = this.read(`SELECT dateTime FROM met
         WHERE fullFinger = ?
         ORDER BY dateTime DESC 
         LIMIT 1
         `, fullFinger)
      if((!rows) || rows.length!=1 )
         return MeDB.MAXINT
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
      const refHost = Utils.getHostname(params.referrer) 
      const curHost = Utils.getHostname(params.domain)      

      if(curHost==refHost)
         referrerLocalFlag = 1

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

      const geo:any = await MeDB._geo.getG(ip)
      // also get sqlite 
      
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
      geo.lat, geo.long, geo.geoTz, geo.cou, geo.cou2, geo.sub, geo.state, geo.city, 
      geo.city2, geo.post, geo.aso, geo.proxy,
      params.bro, params.os, params.mobile, params.tz, params.lang, langCou, params.ie,
      params.h +'x'+ params.w, date
     )//
     this.log.info('dev')

      
   }//()
   
   writeError(domain, fullFinger, ip:string, url, message, extra, mode?, name?, stack?,) {
      const date = DateTime.local().toString()

      if(!message) message = null
      if(!mode) mode = null
      if(!name) name = null
      if(!stack) stack= null

      if (typeof stack !== 'string') 
         stack = JSON.stringify(stack)
   

      // is error new
      this.write(`INSERT INTO error( domain, dateTime, fullFinger, ip, url,
         message, mode, name, stack)
         VALUES
      (  ?, ?, ?, ?, ?,
         ?,?,?,?
      )`
      ,
         domain, date, fullFinger, ip, url,
         message, mode, name, stack
      )//
      this.log.info('err')

      this.writeDevice(fullFinger, ip, extra, domain, date )

   }//()


   static _fingeExists(fullFinger, ctx:BaseDBS) {
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
         ) `)
      this.write(`CREATE INDEX i_device ON device(domain, fullFinger, dateTime DESC)`)

      this.log.info('schemaDone')

    }//()


   dashPageViews(domain){ //visitors for the 45 days by day total. new vs returning

      const dau = `SELECT date(dateTime) AS date, count(*) AS COUNT 
      FROM met 
      WHERE domain = ? AND dateTime >= ? 
      GROUP BY date 
      ORDER by date DESC 
      `
      //date
      let weeksAgo = DateTime.local().minus({days: 45 + 1})
      this.log.info(weeksAgo.toString())
      const rows = this.read(dau, domain, weeksAgo.toString() )
      return rows

      let newOrReturning = `SELECT met.fullFinger, date(device.dateTime) AS first, date(met.dateTime) AS visited, count(*) AS COUNT
      FROM met
      INNER JOIN device ON met.fullFinger = device.fullFinger
      GROUP BY met.fullFinger, first, visited
      ORDER by first, visited DESC 
      `
      // WHERE domain = ? and dateTime >= ? 
   }

   dashPgPopular(domain) { //page title/url

      let weeksAgo = DateTime.local().minus({days:  30 + 1 })

      let s =` SELECT url, count(*) AS COUNT 
      FROM met
      WHERE domain = ? AND dateTime >= ? 
      GROUP BY url
      ORDER BY COUNT DESC
      LIMIT 15
      `
      const rows = this.read(s, domain, weeksAgo.toString() )
      return rows
   }

   dashRef(domain){ // where they came from

      //let weeksAgo = DateTime.local().minus({days:  30 + 1 })

      let s =` SELECT referrer, count(*) AS COUNT 
      FROM met
      WHERE domain = ? AND referrerLocalFlag = 0 
      GROUP BY referrer
      ORDER BY COUNT DESC
      LIMIT 15
      `
      const rows = this.read(s, domain )
      return rows
   }//()

   dashGeo(domain){ // where are they
      
      let weeksAgo = DateTime.local().minus({days:  30 + 1 })

      let state = ` SELECT  lang, cou, sub, count(*) AS COUNT
      FROM device
      INNER JOIN met ON met.fullFinger = device.fullFinger
      WHERE device.domain = ? AND met.dateTime >= ? 
      GROUP BY lang, cou, sub
      ORDER BY COUNT DESC
      LIMIT 20
      `
      const rows = this.read(state, domain, weeksAgo.toString() )
      return rows

      let aso = `SELECT tz, lang, cou, sub, aso, count(*) AS COUNT
      FROM device
      GROUP BY tz, lang, cou, sub, aso
      `
   }//()


   dashRecentUsers(domain) {
      
      const rows = this.read(`
      SELECT m.dateTime, d.ip, m.title, d.cou, d.sub, d.aso, d.mobile
      FROM met m, device d
      WHERE m.fullFinger = d.fullFinger
      AND m.datetime = ( SELECT MAX(dateTime) FROM met m2 WHERE m2.fullFinger = m.fullFinger )
      AND d.domain = ? 
      ORDER BY m.dateTime DESC 
      LIMIT 60
       `, domain)

       return rows

   }//()


}//()