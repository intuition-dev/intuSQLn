
const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

import { BaseRPCMethodHandler } from 'http-rpc/lib/Serv'
import { AgDB } from '../db/AgDB'

export class AgentHandler extends BaseRPCMethodHandler {
    
   db:AgDB
   
   constructor(db) {
      super(1)
      this.db =db
   }

   agentSmall(params) {
      const ip = params.remoteAddress

      this.db.writeData(params)

      console.log(params)
      return "OK"
   }//()
   
   agentBig(params) {
      const ip = params.remoteAddress
      //console.log(params)
      return "OK"
   }//()

}//class