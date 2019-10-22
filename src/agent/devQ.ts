
const URL = require('url')

var logger = require('tracer').console()

// from mbake
import { BaseRPCMethodHandler, ExpressRPC } from "mbake/lib/Serv"
import { MDB } from "../dsrv/MDB"

const m = new MDB()
m.schema()

m.showLastPerSecond()