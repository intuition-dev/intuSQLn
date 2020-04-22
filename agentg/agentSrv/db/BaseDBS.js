"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
/**
 * SQLite
 */
class BaseDBS {
    constructor() {
        this.log = new terse_b_1.TerseB(this.constructor.name);
        this.sqlite3 = require('sqlite3').verbose();
    }
    defCon(_ffn) {
        this._ffn = _ffn;
        this._db = new this.sqlite3.Database(this._ffn);
    }
    async tableExists(tab) {
        try {
            const row = await this.readOne("SELECT name FROM sqlite_master WHERE type=\'table\' AND name= ?", tab);
            this.log.info(row['name']);
            if (row['name'] == tab)
                return true;
            return false;
        }
        catch (err) {
            return false;
        }
    } //()
    // passs in an array
    read(sql, ...args) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ._db.all(sql, args, function (err, rows) {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        }); //pro
    } //()
    // passs in an array
    readOne(sql, ...args) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ._db.get(sql, args, function (err, row) {
                if (err)
                    reject(err);
                else
                    resolve(row);
            });
        }); //pro
    } //()
    // passs in an array
    write(sql, ...args) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ._db.run(sql, args, function (err) {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        }); //pro
    } //()
} // class
exports.BaseDBS = BaseDBS;
BaseDBS.MAXINT = 9223372036854775807;
