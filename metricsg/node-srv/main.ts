// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0


 

const log = bunyan.createLogger({src: true, stream: formatOut, name: "main"})

import {  Serv }  from 'http-rpc/lib/Serv'

import {  MetricsHandler } from "./handler/MetricsHandler"
import {  DashHandler } from "./handler/DashHandler"
import { MeDB } from "./db/MeDB"

const express = require('express')

const srv = new Serv(['*']) 

const db =  new MeDB()

const mh = new MetricsHandler(db)

Serv._expInst.use(express.json( {type: '*/*'} ) )

Serv._expInst.use(function(req,resp, next){
   log.info(req.originalUrl)
   next()
})

// old school ajax, not rpc
Serv._expInst.post('/metrics',  mh.metrics)
Serv._expInst.post('/error', mh.error)
Serv._expInst.post('/log', mh.log)

//DASH
const dashH = new DashHandler(db)
srv.routeRPC('api',  dashH)

srv.serveStatic('../wwwApp', 60*60, 60)

Serv._expInst.use(function(req,resp, next){
   log.warn('err, not found', req.originalUrl)
})

srv.listen(3000)

