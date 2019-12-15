import { BaseDBL } from 'mbakex/lib/BaseDBL'
import { Geo } from '../gdb/Geo'
import { Utils } from './Utils'
import { DateTime } from 'luxon'

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "DB"})

const hash = require("murmurhash3js")

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

      const row = rows[0]
      const delta = ( Date.parse(curDate) - row['dateTime']  ) / 1000
      return delta 
   }//()

   async writeMetrics(domain, fullFinger, params, ip) {
      const date = DateTime.local().toString()

      // sameDomain
      let referrerLocalFlag:number = 0
      const refHost = Utils.getHostname(params.referrer)
      const curHost = Utils.getHostname(params.referrer)      

      if(curHost==refHost)
         referrerLocalFlag = 1

      let priorDateTimeDiff:number = this._getPriorDateTimeDiff(fullFinger, date)

      log.info(priorDateTimeDiff, params)
      
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
      this.write(`INSERT INTO device( fullFinger, ip,
         lat, long, cou, sub, post, aso, proxy,
         bro, os, mobile, tz, lang, ie, 
         hw, dateTime)
            VALUES
      ( ?, ?,
       ?,?,?, ?,?,?,?,
       ?,?,?, ?,?,?,
       ?,?
      )`
      ,
      fullFinger, ip, 
      geo.lat, geo.long, geo.cou, geo.sub, geo.post, geo.aso, geo.proxy,
      params.bro, params.os, params.mobile, params.tz, params.lang, params.ie,
      params.h +'x'+ params.w, date
     )//
      
   }//()
   
   XwriteError(domain, ip, url, type, error:string) {
      const date = DateTime.local().toString()

      const ehash:string = hash.x64.hash128(error+domain)

      // is error new
      this.write(`INSERT INTO error( domain, dateTime, ip, url,
         ehash, error, type )
         VALUES
      ( ?, ?, ?, ?,
         ?,?,?
      )`
      ,
         domain, date, ip, url,
         ehash, error, type
      )//

   }//()

   private schema() {

      // SEO
      this.defCon(process.cwd(), '/db/met.db')

      const exists = this.tableExists('met')
      if(exists) return
      log.info('schema')

      // todo: url  get full message
      this.write(`CREATE TABLE error( domain, dateTime TEXT, ip, url,
            ehash, error, type 
         ) `)
      this.write(`CREATE INDEX error_ehash ON error(ehash)`)
      this.write(`CREATE INDEX error_desc ON error(domain, dateTime DESC)`)

      this.write(`CREATE TABLE met( fullFinger TEXT, dateTime TEXT, domain,
            url, title, referrer, domTime, 
            referrerLocalFlag INTEGER, priorDateTimeDiff INT
         ) `)
      this.write(`CREATE INDEX met_dt ON met (fullFinger, dateTime DESC, domTime)`)
         
      this.write(`CREATE TABLE device( fullFinger TEXT NOT NULL PRIMARY KEY, ip TEXT,
            lat, long, cou, sub, post, aso, proxy INTEGER,
            bro, os, mobile INTEGER, tz, lang, ie INTEGER, 
            hw, dateTime TEXT
         ) WITHOUT ROWID `)
      this.write(`CREATE INDEX device_ip ON device(ip, dateTime DESC)`)

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

      let state = ` SELECT tz, lang, cou, sub, count(*) AS COUNT
      FROM device
      INNER JOIN met ON met.fullFinger = device.fullFinger
      WHERE domain = ? AND met.dateTime >= ? 
      GROUP BY tz, lang, cou, sub
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
      SELECT m.fullFinger, m.dateTime, d.ip, m.title, d.cou, d.sub, d.aso, d.mobile
      FROM met m, device d
      WHERE m.fullFinger = d.fullFinger
      AND m.datetime = ( SELECT MAX(dateTime) FROM met m2 WHERE m2.fullFinger = m.fullFinger )
      AND domain = ? 
      ORDER BY m.dateTime DESC 
      LIMIT 60
       `, domain)
   }//()


}//()