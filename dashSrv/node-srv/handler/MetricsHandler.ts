import { MeDB } from "../db/MeDB"
import { Geo } from "../gdb/Geo"

const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "MetricsHandler"})

log.info('hand')
const hash = require("murmurhash3js")

export class MetricsHandler {
  
   static _geo: Geo
   static _db:MeDB
   constructor() {
      MetricsHandler._db =  new MeDB()
      MetricsHandler._geo = new Geo()
   }

   // do seo search for title via api

   // perf trace route

   // percent chance of receiving
   
   async metrics1911(req, resp) {// RUM, APM, 

      let params = req.body
      
      // ip + 2 fingers + orgCode
      let ip = req.connection.remoteAddress
      const orgCode = params.orgCode
      let str:string = orgCode + params.fid + params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)
      
      try {
      ip = '64.78.253.68'
      const geo = await MetricsHandler._geo.get(ip)

      MetricsHandler._db.writeMetrics(fullFinger, params, ip, geo)
      } catch(err) {
         log.warn(err)
      }
      resp.send('OK')
         
   }//()
   
   error(req, resp) {

      let err = req.body

      let orgCode = err['orgCode'] 
      let met = err['met'] 
      let type = err['type']
      let error = err['error']
      
      met = JSON.stringify(met)
      error = JSON.stringify(error)

      MetricsHandler._db.writeError(orgCode, met, type, error)
      resp.send('OK')
      
   }//()
   
   log(req, resp) {
      resp.send('OK')

      let params = req.body
      log.info(params)
         
   }//()

}