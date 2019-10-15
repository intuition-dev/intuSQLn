"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker = require('faker');
const guid = require('uuid/v4');
const MDB_1 = require("../srv/MDB");
const db = new MDB_1.MDB();
db.schema();
class LoadGen {
    run() {
        const send = {
            guid: guid(), ip: faker.internet.ip(),
            host: faker.internet.userName(),
            nicR: faker.random.float(), nicT: faker.random.float(),
            memFree: faker.random.float(), memUsed: faker.random.float(),
            cpu: faker.random.float(),
            dt_stmp: new Date().toISOString()
        };
        db.ins(send);
    }
}
exports.LoadGen = LoadGen;
