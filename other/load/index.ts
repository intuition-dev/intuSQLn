
const URL = require('url')

var logger = require('tracer').console()

import { LoadGen } from "./lib/LoadGen"

new LoadGen().run()

