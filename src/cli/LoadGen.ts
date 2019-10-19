
const faker = require('faker')
const guid = require('uuid/v4')
const perfy = require('perfy')

var logger = require('tracer').console()

import { MDB } from "../srv/MDB"

const db = new MDB()

export class LoadGen {
   
    async run() {
        await db.schema()

        perfy.start('loop')
        var i = 0
        do {
            i++
            await this.single()
        } while (i< 100 * 1000)
        
        await db.count()
        
        var result = perfy.end('loop')
        logger.trace(result.time) // 4.3

        process.exit()
    }//()

    async single() {
        const send = {
            guid: guid(), ip: faker.internet.ip(),
            host: faker.internet.userName(),
            nicR: faker.random.number(), nicT: faker.random.number(),
            memFree: faker.random.number(), memUsed: faker.random.number(),
            cpu: faker.random.number(),
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