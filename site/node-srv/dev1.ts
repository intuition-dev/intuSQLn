
const URL = require('url')



import { MDB } from "./lib/MDB"
import { DashHandler } from "./handler/DashHandler"

const m = new MDB()

m.showLastPerSecond()
