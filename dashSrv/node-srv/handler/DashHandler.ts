import { BaseRPCMethodHandler } from 'mbake/lib/Serv'

import { MDB } from '../lib/MDB'

var logger = require('tracer').console()

export class DashHandler extends BaseRPCMethodHandler {
 
   mdb:MDB

   constructor(mdb) {
      super()
      this.mdb = mdb
   }

   dash(resp, params) {

      let ret = this.mdb.showLastPerSecond()

      //logger.trace(Object.keys( ret))

      this.ret(resp, ret, null, null)

   }//()

}