

 

const log = bunyan.createLogger({src: true, stream: formatOut, name: "some name"})

import { BaseNDBSi } from 'mbakex/lib/BaseNDBSi'

export class DB extends BaseNDBSi  {

   constructor() {
      super()

      this.schema()
   }//()


   fastCon(path,  fn) {
      this._fn = path + fn
      log.info(this._fn)
      this._db = new BaseNDBSi.Database(this._fn)//, {memory:true})

      this._db.pragma('cache_size = 5000')//20meg in 4K
      log.info(this._db.pragma('cache_size', { simple: true }))

      this._db.pragma('busy_timeout=120000') // 2 minutes
      this._db.pragma('synchronous=OFF')
      this._db.pragma('journal_mode=WAL') 
      this._db.pragma('temp_store=MEMORY')

      this._db.pragma('automatic_index=false')
      this._db.pragma('foreign_keys=false')
      this._db.pragma('secure_delete=false')

      this._db.pragma('read_uncommitted=true') // no locking
      this._db.pragma('cache_spill=false')
      this._db.pragma('mmap_size=102400000') // 100meg in B

      this._db.pragma('locking_mode=EXCLUSIVE') // 3rd party connection, or NORMAL
      log.info(this._db.pragma('locking_mode', { simple: true }))


   }


   private schema() {
      this.fastCon(process.cwd(), '/aa.db')

      const exists = this.tableExists('mon')
      if(exists) return

      log.info('.')
      // shard is ip for now, should be geocode
      // dt_stamp is timestamp of last change in GMT
      this.write(`CREATE TABLE mon( guid, shard, 
         host, 
         nicR, nicT,
         memFree, memUsed,
         cpu,            
         dt_stamp TEXT) `)

      //this.write(`CREATE INDEX mon_dt_stamp ON mon (host, dt_stamp DESC)`)
    }

   ins(params) {
      //log.info(Date.now(), params)

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

   }//()

   showLastPerSecond(host?) {

      const rows = this.read(`SELECT datetime(dt_stamp, 'localtime') as local, * FROM mon
         ORDER BY host, dt_stamp DESC 
         LIMIT 60
         `)

      const sz = rows.length

      //first pass to get seconds, min and max
      let i
      const rows2 = {}
      for(i = sz -1; i >= 0; i-- ) {
         const row = rows[i]
         let date = new Date(row['local'])
         let seconds = Math.round(date.getTime() /1000)
         
         delete row['dt_stamp']
         delete row['guid']
         delete row['shard']
         
         rows2[seconds]=row
      }//for

      //log.info(rows2)
      return rows2
   }//()

   countMon() {
      const row = this.readOne(`SELECT count(*) as count FROM mon `)
      log.info(row)
   }


}//()
