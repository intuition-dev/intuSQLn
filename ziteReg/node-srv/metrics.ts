
import {  Serv } from "mbake/lib/Serv"

import {  MetricsHandler } from "./handler/MetricsHandler"


const exp = new Serv(['*'])

const mh = new MetricsHandler()

exp.appInst.get('/metrics', mh.handle)

exp.listen(3000)