
const io = require('@pm2/io')

io.init({
   transactions: true, // will enable the transaction tracing
   http: true // will enable metrics about the http server (optional)
 })


const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "index"})

import {  ExpressRPC } from "mbake/lib/Serv"

import {  MetricsHandler } from "./handler/MetricsHandler"

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

const exp = new ExpressRPC() 
exp.makeInstance(['*'])

const mh = new MetricsHandler()

exp.appInst.use(express.json( {type: '*/*'} ) )

exp.appInst.use(function(req,resp, next){
   log.info(req.originalUrl)
   next()
})

exp.appInst.post('/metrics1911',  mh.metrics1911)
exp.appInst.post('/error1911', mh.error1911)
exp.appInst.post('/log', mh.log)

exp.appInst.use(function(req,resp, next){
   log.warn('err', req.originalUrl)
})

exp.listen(3000)

