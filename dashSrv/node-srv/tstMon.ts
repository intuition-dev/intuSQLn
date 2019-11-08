
const URL = require('url')

import { MeDB } from "./lib/MeDB"

import { DashHandler } from "./handler/DashHandler"

const m = new MeDB()

m.showLastPerSecond()
