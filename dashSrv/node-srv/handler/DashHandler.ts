import { BaseRPCMethodHandler } from 'mbake/lib/Serv'

import { MDB } from '../lib/MDB'

var logger = require('tracer').console()

export class DashHandler extends BaseRPCMethodHandler {
 
   mdb:MDB

   constructor(mdb) {
      super()

   }

   dash(resp, params) {

      logger.trace(params)

      let ret = this.mdb.showLastPerSecond()

      this.ret(resp, ret, null, null)

   }//()

}