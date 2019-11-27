
const URL = require('url')


// from mbake
import { BaseRPCMethodHandler, Serv } from "mbake/lib/Serv"

import { MDB } from "./lib/MDB"
import { DashHandler } from "./handler/DashHandler"

const m = new MDB()

m.showLastPerSecond()

const dashSrv = new Serv(['*'])

const handler = new BaseRPCMethodHandler()
dashSrv.routeRPC('monitor', 'monitor', (req, res) => { 

   const params = URL.parse(req.url, true).query
   params['ip'] = req.ip // you may need req.ips
   
   m.ins(params)

   handler.ret(res, 'OK', 0, 0)
})

// dash handler
const dashH = new DashHandler(m)
dashSrv.routeRPC('dash', 'dash', dashH.handleRPC.bind(dashH) )


dashSrv.listen(8888)