"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "main" });
const Serv_1 = require("http-rpc/lib/Serv");
const MetricsHandler_1 = require("./handler/MetricsHandler");
const DashHandler_1 = require("./handler/DashHandler");
const MeDB_1 = require("./db/MeDB");
const express = require('express');
const srv = new Serv_1.Serv(['*']);
const db = new MeDB_1.MeDB();
const mh = new MetricsHandler_1.MetricsHandler(db);
Serv_1.Serv._expInst.use(express.json({ type: '*/*' }));
Serv_1.Serv._expInst.use(function (req, resp, next) {
    log.info(req.originalUrl);
    next();
});
Serv_1.Serv._expInst.post('/metrics', mh.metrics);
Serv_1.Serv._expInst.post('/error', mh.error);
Serv_1.Serv._expInst.post('/log', mh.log);
const dashH = new DashHandler_1.DashHandler(db);
srv.routeRPC('api', dashH);
srv.serveStatic('../wwwApp', 60 * 60, 60);
Serv_1.Serv._expInst.use(function (req, resp, next) {
    log.warn('err, not found', req.originalUrl);
});
srv.listen(3000);
