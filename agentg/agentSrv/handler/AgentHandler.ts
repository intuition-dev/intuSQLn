 
import { TerseB } from "terse-b/terse-b"

import { BaseRPCMethodHandler } from 'http-rpc/lib/Serv'
import { AgDB } from '../db/AgDB'

export class AgentHandler extends BaseRPCMethodHandler {
    
   db:AgDB
   
   constructor(db) {
      super(1)
      this.db =db
   }

   async agentSmall(params) {
      const ip = params.remoteAddress

      await this.db.writeData(params)

      return ["123", "OK"]
   }//()
   
   agentBig(params) {
      const ip = params.remoteAddress
      return ["123", "OK"]
   }//()

}//class