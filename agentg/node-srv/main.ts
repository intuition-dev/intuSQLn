

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "main"})

import {  Serv }  from 'http-rpc/lib/Serv'

const express = require('express')

const srv = new Serv(['*']) 

// Serv._expInst.use(express.json( {type: '*/*'} ) )

Serv._expInst.use(function(req,resp, next){
   log.info(req.originalUrl)
   next()
})

Serv._expInst.post('/metrics',  mh.metrics)

Serv._expInst.use(function(req,resp, next){
   log.warn('err, not found', req.originalUrl)
})

srv.listen(3000)

