"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
var logger = require('tracer').console();
class BBaseDBL {
    con(fn) {
        this._fn = fn;
        this._db = new BBaseDBL.Database(fn);
        this._db.pragma('cache_size = 5000');
        logger.trace(this._db.pragma('cache_size', { simple: true }));
        this._db.pragma('synchronous=OFF');
        this._db.pragma('count_changes=OFF');
        this._db.pragma('journal_mode=MEMORY');
        this._db.pragma('temp_store=MEMORY');
        this._db.pragma('locking_mode=EXCLUSIVE');
        logger.trace(this._db.pragma('locking_mode', { simple: true }));
    }
    tableExists(tab) {
        try {
            const row = this.readOne("SELECT name FROM sqlite_master WHERE type=\'table\' AND name= ?", tab);
            if (row['name'] == tab)
                return true;
            return false;
        }
        catch (err) {
            return false;
        }
    }
    write(sql, ...args) {
        const stmt = this._db.prepare(sql);
        const info = stmt.run(args);
        return info.changes;
    }
    read(sql, ...args) {
        const stmt = this._db.prepare(sql);
        return stmt.all(args);
    }
    readOne(sql, ...args) {
        const stmt = this._db.prepare(sql);
        return stmt.get(args);
    }
}
exports.BBaseDBL = BBaseDBL;
BBaseDBL.Database = require('better-sqlite3');
