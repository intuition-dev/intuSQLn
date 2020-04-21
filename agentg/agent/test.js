"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SysAgent_1 = require("./lib/SysAgent");
SysAgent_1.SysAgent.statsBig().then(function (data) {
    console.log(data);
});
