
import {  ExpressRPC } from "mbake/lib/Serv"

import {  MetricsHandler } from "./handler/MetricsHandler"


const exp = new ExpressRPC() 
exp.makeInstance(['*'])

const mh = new MetricsHandler()

exp.appInst.get('/metrics', mh.handle)

exp.listen(3000)