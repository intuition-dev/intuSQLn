 
import { TerseB } from "terse-b/terse-b"

import { BaseRPCMethodHandler } from 'http-rpc/lib/Serv'
import { AgDB } from '../db/AgDB'

export class DashHandler extends BaseRPCMethodHandler {
    
   db:AgDB
   
   constructor(db) {
      super(1)
      this.db =db
   }

   async getBoxes(params) {

      return await ["123", this.db.getBoxes()]
   }//()
   
   async getBoxData(params) {
      let box_id = params.box_id
      return await ["123", this.db.getBoxData(box_id)]

   }//()

}//class