import { BaseRPCMethodHandler } from 'mbake/lib/Serv'

import { MDB } from '../lib/MDB'


export class DashHandler extends BaseRPCMethodHandler {
 
   mdb:MDB

   constructor(mdb) {
      super()
      this.mdb = mdb
   }

   dash(resp, params) {

      let ret = this.mdb.showLastPerSecond()

      //log.info(Object.keys( ret))

      this.ret(resp, ret, null, null)

   }//()

}