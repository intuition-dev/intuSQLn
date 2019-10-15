// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

const fs = require('fs-extra')

var logger = require('tracer').console()

/**
 * Helper for SQLite3
 */
export class BBaseDBL {
   protected _fn
   protected _db

   static Database = require('better-sqlite3')

   con( fn) {
      this._fn = fn
      this._db = new BBaseDBL.Database(fn)
   }

   async tableExists(tab): Promise<any> { 
      try {
         const row = this.readOne("SELECT name FROM sqlite_master WHERE type=\'table\' AND name= ?", tab)
         if(row['name'] == tab) return true
         return false
      } catch(err) {
         return false
      }   
   }//()

   // returns # of rows changed
   write(sql:string, ...args):number {
         const stmt = this._db.prepare(sql)
         const info= stmt.run(args)
         if(info.changes != 1) logger.trace(info.changes)
         return info.changes
   }

   read(sql:string, ...args):Array<Object> {
      const stmt = this._db.prepare(sql)
      return stmt.all(args)
   }

   readOne(sql:string, ...args):Object {
      const stmt = this._db.prepare(sql)
      return stmt.get(args)
   }

}//class

