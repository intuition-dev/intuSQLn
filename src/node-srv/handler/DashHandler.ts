import { BaseRPCMethodHandler } from 'http-rpc/node-srv/lib/Serv'

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
   
      log.warn('DAU')

      let ret  = this.mdb.dashPageViews('www.ubaycap.com')
      return ret
   }//()

   async popular(req, resp) {

      let ret  = this.mdb.dashPgPopular('www.ubaycap.com')
      return ret
   }//()

   async ref(req, resp) {
      
      let ret  = this.mdb.dashRef('www.ubaycap.com')
      return ret
   }//()

   async geo(req, resp) {
      
      let ret  = this.mdb.dashGeo('www.ubaycap.com')
      return ret
   }//()

   async recent(req, resp) {
      
      let ret  = this.mdb.dashRecentUsers('www.ubaycap.com')
      return ret
   }//() 

}//class
