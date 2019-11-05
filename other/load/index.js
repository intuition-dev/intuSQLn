"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("./lib/DB");
const db = new DB_1.DB();
db.backup('n.db');
