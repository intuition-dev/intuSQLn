"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const URL = require('url');
var logger = require('tracer').console();
const MDB_1 = require("../dsrv/MDB");
const m = new MDB_1.MDB();
m.schema();
m.showLastPerSecond();
