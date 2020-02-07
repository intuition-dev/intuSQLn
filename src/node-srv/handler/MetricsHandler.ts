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

   // perf trace route on ip

   // percent chance of processing vs ignore by domain
   
   async metrics(req, resp) {// RUM, APM, 

      let params = req.body
      
      // ip fingers
      let ip = req.connection.remoteAddress
      const fullDomain = params.domain
      let domain:string = fullDomain.replace('http://','').replace('https://','').split(/[/?#]/)[0]

      let str:string =  domain +  params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)
      
      resp.send('OK')

      try {
         // dev only XXX ***
         // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
         ip = '64.78.253.68'

         MetricsHandler._db.writeMetrics(domain, fullFinger, params, ip)
      } catch(err) {
         log.warn(err)
      }
   }//()
   
   error(req, resp) { //let str:string =  params.fidc + ip

      log.info('error')
      let ip = req.connection.remoteAddress
      let params = req.body
      
      const fullDomain = params.domain
      let domain:string = Utils.getDomain(fullDomain)

      let str:string =  domain + params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)

      let error = params.error

      resp.send('OK')
      
      if(! (MetricsHandler.isJSON(error)))
        MetricsHandler._db.writeError(domain, fullFinger, ip, fullDomain, error, params)
      else {    
         let message = JSON.parse(error)
         log.info(Object.keys(message))
         MetricsHandler._db.writeError(domain, fullFinger, ip, fullDomain, message.message, params, message.mode, message.name, message.stack) 
      }

   }//()
   

   log(req, resp) {
      log.info('log')
      let ip = req.connection.remoteAddress
      let params = req.body
      
      const fullDomain = params.domain
      let domain:string = Utils.getDomain(fullDomain)

      let str:string =  domain + params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)

      console.log(params)
      resp.send('OK')


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