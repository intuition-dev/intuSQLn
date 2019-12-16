import { BaseDBL } from 'mbakex/lib/BaseDBL'
import { Geo } from '../gdb/Geo'
import { Utils } from './Utils'
import { DateTime } from 'luxon'

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "DB"})

// SEO

export class MeDB extends BaseDBL  {

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
      log.info(rows)
      const row = rows[0]
      const delta = ( Date.parse(curDate) - row['dateTime']  ) / 1000
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

      log.info(priorDateTimeDiff)
      
      // pk is assigned by db in this case
      // priorDateTimeDiff is how long since the last load page event - look for last record. Max for never
      
      this.write(`INSERT INTO met( fullFinger, dateTime, domain,
         url, title, referrer, domTime,
         referrerLocalFlag, priorDateTimeDiff )
            VALUES
         ( ?,?,?,
          ?,?,?,?,
          ?,?
         )`
         ,
         fullFinger, date, domain,
         params.domain, params.title, params.referrer, params.domTime,
         referrerLocalFlag, priorDateTimeDiff
      )
   
      // check if fullFinger exists
      if(MeDB._fingeExists(fullFinger, this))
      return

      const geo:any = await MeDB._geo.get(ip)

      // fullFinger is PK
      this.write(`INSERT INTO device( domain, fullFinger, ip,
         lat, long, cou, sub, post, aso, proxy,
         bro, os, mobile, tz, lang, ie, 
         hw, dateTime)
            VALUES
      ( ?, ?, ?,
       ?,?,?, ?,?,?,?,
       ?,?,?, ?,?,?,
       ?,?
      )`
      ,
      domain, fullFinger, ip, 
      geo.lat, geo.long, geo.cou, geo.sub, geo.post, geo.aso, geo.proxy,
      params.bro, params.os, params.mobile, params.tz, params.lang, params.ie,
      params.h +'x'+ params.w, date
     )//
      
   }//()
   
   writeError(domain, fullFinger, ip:string, url, message, mode?, name?, stack?) {
      const date = DateTime.local().toString()

      if(!message) message = ''
      if(!mode) mode = ''
      if(!name) name = ''
      if(!stack) stack= ''

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
      this.defCon(process.cwd(), '/db/met.db')

      const exists = this.tableExists('met')
      if(exists) return
      log.info('schema')

  
      this.write(` CREATE TABLE error( domain, dateTime TEXT, fullFinger, ip TEXT, url, message TEXT, mode TEXT, name TEXT, stack TEXT
      ) `)
      this.write(`CREATE INDEX i_error ON error(domain, fullFinger, dateTime DESC)`)

      this.write(`CREATE TABLE met( domain, fullFinger TEXT, dateTime TEXT, 
            url, title, referrer, domTime, 
            referrerLocalFlag INTEGER, priorDateTimeDiff INT
         ) `)
      this.write(`CREATE INDEX i_met ON met (domain, dateTime DESC)`)
         
      this.write(`CREATE TABLE device( domain, fullFinger TEXT NOT NULL PRIMARY KEY, ip TEXT,
            lat, long, cou, sub, post, aso, proxy INTEGER,
            bro, os, mobile INTEGER, tz, lang, ie INTEGER, 
            hw, dateTime TEXT
         ) WITHOUT ROWID `)
      this.write(`CREATE INDEX i_device ON device(domain, fullFinger, dateTime DESC)`)

    }//()


   dashPageViews(domain){ //visitors for the 2 weeks by day total. new vs returning

      const dau = `SELECT date(dateTime) AS date, count(*) AS COUNT 
      FROM met 
      WHERE domain = ? AND dateTime >= ? 
      GROUP BY date 
      ORDER by date DESC 
      `
      //date
      let weeksAgo = DateTime.local().minus({days: 7*2 + 1})
      const rows = this.read(dau, domain, weeksAgo.toString() )
      console.log(rows)
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
      `
      const rows = this.read(s, domain, weeksAgo.toString() )
      console.log(rows)
      return rows
   }

   dashRef(domain){ // where they came from

      //let weeksAgo = DateTime.local().minus({days:  30 + 1 })

      let s =` SELECT referrer, count(*) AS COUNT 
      FROM met
      WHERE domain = ? AND referrerLocalFlag = 0 
      GROUP BY referrer
      `
      const rows = this.read(s, domain )
      console.log(rows)
      return rows
   }//()

   dashGeo(domain){ // where are they
      
      let weeksAgo = DateTime.local().minus({days:  30 + 1 })

      let state = ` SELECT  lang, cou, sub, count(*) AS COUNT
      FROM device
      INNER JOIN met ON met.fullFinger = device.fullFinger
      WHERE domain = ? AND met.dateTime >= ? 
      GROUP BY  lang, cou, sub
      `
      const rows = this.read(state, domain, weeksAgo.toString() )
      console.log(rows)
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
      AND domain = ? 
      ORDER BY m.dateTime DESC 
      LIMIT 60
       `, domain)

       console.log(rows)
       return rows

   }//()


}//()