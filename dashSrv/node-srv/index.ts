
import {  ExpressRPC } from "mbake/lib/Serv"

import {  MetricsHandler } from "./handler/MetricsHandler"

const express = require('express');

const exp = new ExpressRPC() 
exp.makeInstance(['*'])

const mh = new MetricsHandler()

exp.appInst.use(express.json( {type: '*/*'} ) )

exp.appInst.use(function(req,resp, next){
   //console.log(req.originalUrl)
   next()
})

exp.appInst.post('/metrics1911',  mh.metrics1911)
exp.appInst.post('/error', mh.error)
exp.appInst.post('/log', mh.log)


exp.appInst.use(function(req,resp, next){
   console.log('err', req.originalUrl)
   
})

exp.listen(3000)

