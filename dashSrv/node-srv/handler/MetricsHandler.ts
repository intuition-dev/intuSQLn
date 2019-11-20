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
   constructor() {
      MetricsHandler._db =  new MeDB()
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

      let str:string =  params.fid + params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)
      
      try {
         MetricsHandler._db.writeMetrics(domain, fullFinger, params, ip)
      } catch(err) {
         log.warn(err)
      }
      resp.send('OK')
   }//()
   
   error1911(req, resp) {

      let ip = req.connection.remoteAddress
      let err = req.body

      const fullDomain = err.domain
      let domain:string = Utils.getDomain(fullDomain)

      let type = err['type']
      let error = err['error']
      
      error = JSON.stringify(error)

      MetricsHandler._db.writeError(domain, ip, type, error)
      resp.send('OK')
   }//()
   
   log(req, resp) {
      resp.send('OK')

      let params = req.body
      const fullDomain = params.domain
      let domain:string = Utils.getDomain(fullDomain)

      log.info(params)
   }//()

}//class