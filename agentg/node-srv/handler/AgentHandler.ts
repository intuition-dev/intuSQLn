
const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

import { BaseRPCMethodHandler } from 'http-rpc/lib/Serv'

export class AgentHandler extends BaseRPCMethodHandler {
    
   constructor(db) {
      super(1)
   }

   agentSmall(params) {
      // ip fingers
     // let ip = req.connection.remoteAddress
      console.log(params)
      return "OK"
   }//()
   
   agentBig(params) {
      // ip fingers
     // let ip = req.connection.remoteAddress
      console.log(params)
      return "OK"
   }//()

}//class