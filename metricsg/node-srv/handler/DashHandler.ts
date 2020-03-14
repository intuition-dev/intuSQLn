import { BaseRPCMethodHandler } from 'http-rpc/lib/Serv'

import { MeDB } from '../db/MeDB'


 


export class DashHandler extends BaseRPCMethodHandler {
 
   log:any = new TerseB(this.constructor.name)

   mdb:MeDB

   constructor(mdb) {
      super(1)
      this.mdb = mdb
   }

   async pageViews(params) {
      this.log.info(params)
      let ret  = this.mdb.dashPageViews('www.ubaycap.com')
      return ret
   }//()

   async popular(params) {
      this.log.info(params)
      let ret  = this.mdb.dashPgPopular('www.ubaycap.com')
      return ret
   }//()

   async ref(params) {
      this.log.info(params)      
      let ret  = this.mdb.dashRef('www.ubaycap.com')
      return ret
   }//()

   async geo(params) {
      this.log.info(params)
      let ret  = this.mdb.dashGeo('www.ubaycap.com')
      return ret
   }//()

   async recent(params) {
      this.log.info(params)
      let ret  = this.mdb.dashRecentUsers('www.ubaycap.com')
      return ret
   }//() 

}//class
