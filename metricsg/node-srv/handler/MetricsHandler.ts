import { MeDB } from "../db/MeDB"
import { Utils } from "../db/Utils"


 


const hash = require("murmurhash3js")

export class MetricsHandler {
  
   _log:any = new TerseB(this.constructor.name)


   static _db:MeDB
   
   constructor(db) {
      MetricsHandler._db = db
   }

   // perf trace route on ip

   // percent chance of processing vs ignore by domain
   
   async metrics(req, resp) {// RUM, APM, 

      let params = req.body
      
      // ip fingers
      let ip = req.socket.remoteAddress
      const fullDomain = params.domain
      let domain:string = fullDomain.replace('http://','').replace('https://','').split(/[/?#]/)[0]

      let str:string =  domain +  params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)
      
      resp.send('OK')

      try {
         // dev only XXX ***
         // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
         //ip = '64.78.253.68'

         MetricsHandler._db.writeMetrics(domain, fullFinger, params, ip)
      } catch(err) {
         this._log.warn(err)
      }
   }//()
   
   error(req, resp) { //let str:string =  params.fidc + ip
      this._log.info('error')
      let ip = req.socket.remoteAddress
      let params = req.body
      
      const fullDomain = params.domain
      let domain:string = Utils.getDomain(fullDomain)

      let str:string =  domain + params.fidc + ip
      const fullFinger:string = hash.x64.hash128(str)

      let error = params.error

      resp.send('OK')
      
      // dev only XXX ***
      // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      //ip = '64.78.253.68'
      
      if(! (MetricsHandler.isJSON(error)))
        MetricsHandler._db.writeError(domain, fullFinger, ip, fullDomain, error, params)
      else {    
         let message = JSON.parse(error)
         this._log.info(Object.keys(message))
         MetricsHandler._db.writeError(domain, fullFinger, ip, fullDomain, message.message, params, message.mode, message.name, message.stack) 
      }

   }//()
   

   log(req, resp) {
      this._log.info('log')
      let ip = req.socket.remoteAddress
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