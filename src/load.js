"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger = require('tracer').console();
const LoadGen_1 = require("./cli/LoadGen");
new LoadGen_1.LoadGen().run();
