
var logger = require('tracer').console()
const os = require('os')

import { BaseDBL } from 'mbake/lib/BaseDBL'

export class MDB extends BaseDBL  {
    

    constructor() {
        super()
        this.defCon(process.cwd(), '/XXX.db')
    }//()


    async schema() {
        logger.trace('.')
        // shard is ip for now, should be geocode
        // dt_stamp is timestamp of last change in GMT
        await this.write(`CREATE TABLE mon( guid, shard, 
            host, 
            nicR, nicT,
            memFree, memUsed,
            cpu,            
            dt_stamp DATETIME) `)

        await this.write(`CREATE INDEX mon_dt_stamp ON mon (dt_stamp DESC, host)`)
    }

    async ins(params) {
        //logger.trace(Date.now(), params)

        this.write(`INSERT INTO mon( guid, shard, 
            host, 
            nicR, nicT,
            memFree, memUsed,
            cpu,            
            dt_stamp) 
                VALUES
            ( ?,?,
            ?,?,?,
            ?,?,?,
            ? )`
            ,
            params.guid, params.ip,
            params.host,
            params.nicR, params.nicT,
            params.memFree, params.memUsed,
            params.cpu,
            params.dt_stamp 
        )

        let sql = (`SELECT datetime(dt_stamp, 'localtime') as local, * FROM mon
            ORDER BY dt_stamp DESC `)

    }//()

    async count() {
        const row = this.readOne(`SELECT count(*) as count FROM mon `)
        logger.trace(row)
    }

    async memory() {
        const row = this.readOne(`SELECT sqlite3_memory_used()`)
        logger.trace(row)

    }

    checkNode() {
        logger.trace(os.freemem(), os.totalmem())
    }

}//()
