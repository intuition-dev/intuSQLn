import { BaseRPCMethodHandler } from 'mbake/lib/Serv'

import { MeDB } from '../db/MeDB'

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "Metrics handler"})

export class DashHandler extends BaseRPCMethodHandler {
 
   mdb:MeDB

   constructor(mdb) {
      super()
      this.mdb = mdb
   }

   async DAU(req, resp) {

      let params = req.body

      let ret 


      log.info(Object.keys( ret))

      this.ret(resp, ret, null, null)


   }//()

}//

/*  'www.metabake.net'

   dashDAU(domain) //visitors for a week by day total. new vs returning
  

   dashPopular(domain)  //page title/url


   dashRef(domain) // where they came from


   dashGeo(domain) // where are they.
     

   dashPopularity(domain) // user by page


*/