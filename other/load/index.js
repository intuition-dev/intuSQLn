"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const URL = require('url');
var logger = require('tracer').console();
const LoadGen_1 = require("./lib/LoadGen");
new LoadGen_1.LoadGen().run();
