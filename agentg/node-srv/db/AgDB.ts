import { BaseDBL } from 'mbakex/lib/BaseDBL'

import { DateTime } from 'luxon'

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

export class AgDB extends BaseDBL  {

   log = bunyan.createLogger({src: true, stream: formatOut, name: this.constructor.name })
 
   constructor() {
      super()

      this.schema()
   }//()

   private _getPriorDateTimeDiff(fullFinger, curDate) { 
      const rows = this.read(`SELECT dateTime FROM met
         WHERE fullFinger = ?
         ORDER BY rowid DESC 
         LIMIT 1
         `, fullFinger)
      
      this.log.info(rows)
      const row = rows[0]
      const delta = ( Date.parse(curDate) - Date.parse(row['dateTime']) )
      this.log.info(delta)
      return delta 
   }//()

   async writeData(params) {
      const date = DateTime.local().toString()

      let priorTimeDiff:number = this._getPriorDateTimeDiff(fullFinger, params.dt_stamp)
      
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
      this.log.info('data')

   }//()

   private schema() {
      this.defCon(process.cwd(), '/ag.db')

      const exists = this.tableExists('data')
      this.log.info('schema', exists)

      if(exists) return
           
      this.write(` CREATE TABLE data( box_id, dateTime TEXT, host, ip TEXT,  timeDif,
         ioR, ioW, fsR, fsW, openMax, openAlloc,
         nicR, nicT, memFree, memUsed, swapUsed, swapFree,
         cpu, cpiIdle
      ) `)

      this.write(`CREATE INDEX i_data ON data(box_id, dateTime DESC, cpu, memUsed, nicR, nicT )`)

      this.log.info('schemaDone')

    }//()


}//()