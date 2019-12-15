import { MeDB } from "../db/MeDB"
import { Utils } from "../db/Utils"

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "MetricsHandler"})

log.info('hand')
const hash = require("murmurhash3js")

export class MetricsHandler {
  
   static _db:MeDB
   
   constructor(db) {
      MetricsHandler._db = db
   }

   // do seo search for title via api

   // perf trace route

   // percent chance of receiving
   
   async metrics1911(req, resp) {// RUM, APM, 

      let params = req.body
      
      // ip + 2 fingers
      let ip = req.connection.remoteAddress
      const fullDomain = params.domain
      let domain:string = fullDomain.replace('http://','').replace('https://','').split(/[/?#]/)[0]

      let str:string =  params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)
      
      try {
         // local only
         // ip = '64.78.253.68'

         MetricsHandler._db.writeMetrics(domain, fullFinger, params, ip)
      } catch(err) {
         log.warn(err)
      }
      resp.send('OK')
   }//()
   
   error1911(req, resp) { //let str:string =  params.fid + params.fidc + ip

      let ip = req.connection.remoteAddress
      let params = req.body
      
      const fullDomain = params.domain
      let domain:string = Utils.getDomain(fullDomain)

      let fid = params.fidc
      let error = params.error
      MetricsHandler.isJSON(error)

      log.info(params)

      // MetricsHandler._db.writeError(domain, ip, fullDomain, type, error)
      resp.send('OK')
   }//()
   
   log(req, resp) {
      resp.send('OK')
      let ip = req.connection.remoteAddress
      let params = req.body

      const fullDomain = params.domain
      let domain:string = Utils.getDomain(fullDomain)

      let fid = params.fidc
      let arg = params.arg
      MetricsHandler.isJSON(arg)

      log.info(params)
   }//()

   static isJSON(str):boolean {
      try {
         JSON.parse(str)
         return true
     } catch (e) {
         return false
      }

   }//()

}//class