import { BaseRPCMethodHandler } from 'http-rpc/lib/Serv'

import { MeDB } from '../db/MeDB'

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "Metrics handler"})

export class DashHandler extends BaseRPCMethodHandler {
 
   mdb:MeDB

   constructor(mdb) {
      super(1)
      this.mdb = mdb
   }

   async pageViews(params) {
      log.info(params)
      let ret  = this.mdb.dashPageViews('www.ubaycap.com')
      return ret
   }//()

   async popular(params) {
      log.info(params)
      let ret  = this.mdb.dashPgPopular('www.ubaycap.com')
      return ret
   }//()

   async ref(params) {
      log.info(params)      
      let ret  = this.mdb.dashRef('www.ubaycap.com')
      return ret
   }//()

   async geo(params) {
      log.info(params)
      let ret  = this.mdb.dashGeo('www.ubaycap.com')
      return ret
   }//()

   async recent(params) {
      log.info(params)
      let ret  = this.mdb.dashRecentUsers('www.ubaycap.com')
      return ret
   }//() 

}//class
