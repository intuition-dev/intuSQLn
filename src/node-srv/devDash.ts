
const URL = require('url')

// from mbake
import { BaseRPCMethodHandler, Serv }  from 'http-rpc/node-srv/lib/Serv'


import { MeDB } from "./db/MeDB"
import { DashHandler } from "./handler/DashHandler"

const m = new MeDB()

const dashSrv = new Serv(['*'])

const handler = new BaseRPCMethodHandler(1)
dashSrv.routeRPC('monitor', handler)


// dash handler
const dashH = new DashHandler(m)
dashSrv.routeRPC('dash', dashH )

dashSrv.listen(8888)