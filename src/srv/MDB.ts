
const logger = require('tracer').console()

const sqlite3 = require('sqlite3').verbose()

import { BaseDBL } from 'mbake/lib/BaseDBL'

export class MDB extends BaseDBL  {

    static uuid = require('uuid/v4')
    
    protected db

    constructor() {
        super(null, null)
        this.db = new sqlite3.cached.Database(':memory:')

    }//()

    async schema() {
        // geo is ip for now
        // timestamp is date of last change in GMT
        await this._run(this.db.prepare(`CREATE TABLE mon ( guid, shard_geo, 
            host, 
            nicR, nicT,
            memFree, memUsed,
            cpu,            
            load, 
            dt_stamp DATETIME ) `)) 

        await this._run(this.db.prepare(`CREATE INDEX mon_dt_stamp ON mon (dt_stamp DESC, host)`)) 
    }

    async ins(params) {
        console.log(params)

       let stmt = this.db.prepare(`INSERT INTO mon(guid, shard_g, load) 
       VALUES
       ( ?,?,?)`)
        await this._run(stmt, '1l23', 'us', 3
            ,new Date().toUTCString()
        )

        const qry = this.db.prepare(`SELECT * FROM mon `)
        const rows = await this._qry(qry)
        console.log(rows)
  
    }
}//()

