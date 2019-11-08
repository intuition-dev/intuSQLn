import { MeDB } from "../lib/MeDB"
import { Geo } from "../gdb/Geo"

const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "Metrics handler"})

log.info('hand')
const hash = require("murmurhash3js")

export class MetricsHandler {
  
   _geo: Geo
   _db:MeDB
   constructor() {
      this._db =  new MeDB()
      this._geo = new Geo()
   
   }

   // also for error
   // is mobile
   // is tablet
   // ip, zip, country
   // do seo search for title via api

   // perf trace route

   // percent chance of receiving
   
   metrics1911(req, resp) {// RUM, APM, 

      let params = req.body
      
      log.info(params)

      // ip + 2 fingers
      const ip = req.connection.remoteAddress
      let str:string = params.fid + params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)
      
      const geo = this._geo.get(ip)

      this._db.writeMetrics(fullFinger, params, geo)

      resp.send('OK')

         
   }//()
   
   error(req, resp) {

      resp.send('OK')

      let params = req.body
      log.info(params)
         
   }//()
   
   log(req, resp) {
      resp.send('OK')

      let params = req.body
      log.info(params)
         
   }//()

}