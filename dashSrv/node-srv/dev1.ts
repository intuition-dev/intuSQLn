
const URL = require('url')

var logger = require('tracer').console()


import { MDB } from "./lib/MDB"
import { DashHandler } from "./handler/DashHandler"

const m = new MDB()

m.showLastPerSecond()
