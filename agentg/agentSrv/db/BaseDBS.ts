 
import { TerseB } from "terse-b/terse-b"

/**
 * SQLite
 */
export class BaseDBS {
    log:any = new TerseB(this.constructor.name)

    static MAXINT:number = 9223372036854775807 

    sqlite3 = require('sqlite3').verbose()

    protected _ffn
    protected _db 
 
    defCon(_ffn) {
        this._ffn = _ffn
        this._db = new this.sqlite3.Database(this._ffn)
    }


    async tableExists(tab:string) {
        try {
            const row = await this.readOne("SELECT name FROM sqlite_master WHERE type=\'table\' AND name= ?", tab );
            this.log.info(row['name'])
            if (row['name'] == tab)
                return true;
            return false;
        }
        catch (err) {
            return false;
        }
    } //()

    // passs in an array
    read(sql:string, ...args ) {
        const THIZ = this
        return new Promise( function(resolve, reject) {
            THIZ._db.all(sql, args, function(err, rows){
                if(err) reject(err) 
                else resolve(rows)
            })
        })//pro
    }//()

    // passs in an array
    readOne(sql:string, ...args ) {
        const THIZ = this
        return new Promise( function(resolve, reject) {
            THIZ._db.get(sql, args, function(err, row){
                if(err) reject(err) 
                else resolve(row)
            })
        })//pro
    }//()

    // passs in an array
    write(sql:string, ...args ) {
        const THIZ = this
        return new Promise( function(resolve, reject) {
            THIZ._db.run(sql, args, function(err){
                if(err) reject(err) 
                else resolve()
            })
        })//pro

    }//()

}// class