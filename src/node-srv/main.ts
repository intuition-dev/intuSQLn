
const io = require('@pm2/io')
io.init({
   transactions: true, // will enable the transaction tracing
   http: true // will enable metrics about the http server (optional)
 })

const atatus = require("atatus-nodejs")
atatus.start({
    licenseKey: "lic_apm_97ce9f37c93c4535986d44110bb571c8",
    appName: "service",
})

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "index"})

import {  Serv }  from 'http-rpc/node-srv/lib/Serv'

import {  MetricsHandler } from "./handler/MetricsHandler"
import {  DashHandler } from "./handler/DashHandler"
import { MeDB } from "./db/MeDB"

/* debug http
const dhttp = require('http')
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer({})
const dserver = dhttp.createServer(function(req, res) {
   log.info(req.path)
   proxy.web(req, res, { target: 'http://127.0.0.1:3000' });
})
dserver.listen(3001)
log.info('debug on 3001')
*/ //end debug

const express = require('express');

const srv = new Serv(['*']) 

const db =  new MeDB()

const mh = new MetricsHandler(db)

Serv._expInst.use(express.json( {type: '*/*'} ) )

Serv._expInst.use(function(req,resp, next){
   log.info(req.originalUrl)
   next()
})

Serv._expInst.post('/metrics1911',  mh.metrics1911)
Serv._expInst.post('/error1911', mh.error1911)
Serv._expInst.post('/log', mh.log)

//DASH
const dashH = new DashHandler(db)
srv.routeRPC('api',  dashH)

Serv._expInst.use(function(req,resp, next){
   log.warn('err', req.originalUrl)
})

srv.listen(3000)

