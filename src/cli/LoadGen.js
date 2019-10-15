"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker = require('faker');
const guid = require('uuid/v4');
const MDB_1 = require("../srv/MDB");
const db = new MDB_1.MDB();
class LoadGen {
    async run() {
        await db.schema();
        const send = {
            guid: guid(), ip: faker.internet.ip(),
            host: faker.internet.userName(),
            nicR: faker.random.number(), nicT: faker.random.number(),
            memFree: faker.random.number(), memUsed: faker.random.number(),
            cpu: faker.random.number(),
            dt_stmp: new Date().toISOString()
        };
        db.ins(send);
    }
}
exports.LoadGen = LoadGen;
