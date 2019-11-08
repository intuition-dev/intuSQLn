
const URL = require('url')

// from mbake
import { BaseRPCMethodHandler, ExpressRPC } from "mbake/lib/Serv"

import { MeDB } from "./lib/MeDB"
import { DashHandler } from "./handler/DashHandler"

const m = new MeDB()

m.showLastPerSecond()

const dashSrv = new ExpressRPC()
dashSrv.makeInstance(['*'])

const handler = new BaseRPCMethodHandler()
dashSrv.routeRPC('monitor', 'monitor', (req, res) => { 

   const params = URL.parse(req.url, true).query
   params['ip'] = req.ip // you may need req.ips
   
   //m.ins(params)

   handler.ret(res, 'OK', 0, 0)
})

// dash handler
const dashH = new DashHandler(m)
dashSrv.routeRPC('dash', 'dash', dashH.handleRPC.bind(dashH) )

dashSrv.listen(8888)