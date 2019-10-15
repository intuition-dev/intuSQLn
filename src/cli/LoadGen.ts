
const faker = require('faker')
const guid = require('uuid/v4')

import { MDB } from "../srv/MDB"

const db = new MDB()
db.schema()

export class LoadGen {

    run() {

        const send = {
            guid: guid(), ip: faker.internet.ip(),
            host: faker.internet.userName(),
            nicR: faker.random.float(), nicT: faker.random.float(),
            memFree: faker.random.float(), memUsed: faker.random.float(),
            cpu: faker.random.float(),
            dt_stmp: new Date().toISOString()

        }


        db.ins(send)
    }

} // 

/*
params.guid, params.ip,
            params.host,
            params.nicR, params.nicT,
            params.memFree, params.memUsed,
            params.cpu,
            params.dt_stamp 

*/