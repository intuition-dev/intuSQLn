
const URL = require('url')

// from mbake
import { BaseRPCMethodHandler, Serv } from "mbake/lib/Serv"

import { MeDB } from "./db/MeDB"
import { DashHandler } from "./handler/DashHandler"

const m = new MeDB()

const dashSrv = new Serv(['*'])

const handler = new BaseRPCMethodHandler()

dashSrv.routeRPC('monitor', handler)


// dash handler
const dashH = new DashHandler(m)
dashSrv.routeRPC('dash', dashH )

dashSrv.listen(8888)