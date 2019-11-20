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

   dash(resp, params) {

      let ret 

      log.info(Object.keys( ret))

      this.ret(resp, ret, null, null)

   }//()

}//