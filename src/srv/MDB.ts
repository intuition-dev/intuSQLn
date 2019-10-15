
const logger = require('tracer').console()

const os = require('os')

const sqlite3 = require('sqlite3').verbose()

import { BaseDBL } from 'mbake/lib/BaseDBL'

export class MDB extends BaseDBL  {

    //protected db

    constructor() {
        super(process.cwd(), '/XXX.db')
        this.con()
        //this.db = new sqlite3.cached.Database(':memory:')
    }//()

    async schema() {
        // shard is ip for now, should be geocode
        // dt_stamp is timestamp of last change in GMT
        await this._run(this.db.prepare(`CREATE TABLE mon( guid, shard, 
            host, 
            nicR, nicT,
            memFree, memUsed,
            cpu,            
            dt_stamp DATETIME) `)) 

        await this._run(this.db.prepare(`CREATE INDEX mon_dt_stamp ON mon (dt_stamp DESC, host)`)) 
    }

    // fix CPU

    async ins(params) {
        console.log(Date.now(), params)

        let stmt = this.db.prepare(`INSERT INTO mon( guid, shard, 
            host, 
            nicR, nicT,
            memFree, memUsed,
            cpu,            
            dt_stamp) 
                VALUES
            ( ?,?,
            ?,?,?,
            ?,?,?,
            ? )`)
        await this._run(stmt, params.guid, params.ip,
            params.host,
            params.nicR, params.nicT,
            params.memFree, params.memUsed,
            params.cpu,
            params.dt_stamp 
        )

        const qry = this.db.prepare(`SELECT datetime(dt_stamp, 'localtime') as local, * FROM mon
            ORDER BY dt_stamp DESC `)
        const rows = await this._qry(qry)
        console.log(rows)
  
    }

    async memory() {
        const qry = this.db.prepare(`SELECT sqlite3_memory_used()`)
        const rows = await this._qry(qry)
        console.log(rows)

    }

    checkNode() {
        console.log(os.freemem(), os.totalmem())
    }

}//()

// https://stackoverflow.com/questions/1711631/improve-insert-per-second-performance-of-sqlite

// database.run( 'PRAGMA journal_mode = WAL;' );

/*

http://blog.quibb.org/2010/08/fast-bulk-inserts-into-sqlite/

db.run('PRAGMA synchronous=OFF')
db.run('PRAGMA count_changes=OFF')
db.run('PRAGMA journal_mode=MEMORY')
db.run('PRAGMA temp_store=MEMORY')


*/