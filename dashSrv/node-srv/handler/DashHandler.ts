import { BaseRPCMethodHandler } from 'mbake/lib/Serv';

import { MDB } from '../lib/MDB';

var logger = require('tracer').console()

export class DashHandler extends BaseRPCMethodHandler {
 
   mdb:MDB

   constructor(mdb) {
      super()

   }

   dash(resp, params) {

      logger.trace(params)

      this.ret(resp, "OK", null, null)

   }//()

}