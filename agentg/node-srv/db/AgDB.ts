import { BaseDBL } from 'mbakex/lib/BaseDBL'

import { DateTime } from 'luxon'

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

const hash = require("murmurhash3js")

export class AgDB extends BaseDBL  {
   static MAXINT:number = 9223372036854775807 

   log = bunyan.createLogger({src: true, stream: formatOut, name: this.constructor.name })
 
   constructor() {
      super()

      this.schema()
   }//()

   private _getPriorTimeDiff(box_id, curDate) { 
      const row = this.readOne(`SELECT dateTime FROM data
         WHERE box_id = ?
         ORDER BY dateTime DESC 
         LIMIT 1
         `, box_id)
      
      this.log.info(row)
      if(!row) return AgDB.MAXINT
      const delta = ( Date.parse(curDate) - Date.parse(row['dateTime']) )
      this.log.info(delta)
      return delta 
   }//()

   async writeData(params) {

      const box_id:string = hash.x86.hash32(params.host + params.remoteAddress)
      let timeDif:number = this._getPriorTimeDiff(box_id, params.dt_stamp)
      
      this.write(`INSERT INTO data( box_id, dateTime, host, ip, timeDif,
         ioR, ioW, fsR, fsW, openMax, openAlloc,
         nicR, nicT, memFree, memUsed, swapUsed, swapFree,
         cpu, cpiIdle )
            VALUES
         (  ?,?,?, ?, ?,
            ?,?,?, ?, ?,?,
            ?,?,?, ?, ?,?,
            ?,?
         )`
         ,
         box_id, params.dt_stamp, params.host, params.remoteAddress, timeDif,
         params.ioR, params.ioW, params.fsR, params.fsW, params.openMax, params.openAlloc,
         params.nicR, params.nicT, params.memFree, params.memUsed, params.swapUsed, params.swapFree,
         params.cpu, params.cpiIdle
      )

   }//()

   private schema() {
      this.defCon(process.cwd(), '/ag.db')

      const exists = this.tableExists('data')
      this.log.info('schema', exists)

      if(exists) return
           
      this.write(` CREATE TABLE data( box_id TEXT, dateTime TEXT, host, ip TEXT,  timeDif,
         ioR, ioW, fsR, fsW, openMax, openAlloc,
         nicR, nicT, memFree, memUsed, swapUsed, swapFree,
         cpu, cpiIdle
      ) `)

      this.write(`CREATE INDEX i_data ON data(box_id, dateTime DESC, cpu, memUsed, nicR, nicT )`)

      this.log.info('schemaDone')

    }//()

}//()