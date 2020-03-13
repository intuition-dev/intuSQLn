// All rights reserved by INTUITION.DEV |  Cekvenich, licensed under LGPL 3.0

// error 431 : https://stackoverflow.com/questions/32763165/node-js-http-get-url-length-limitation

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "main"})

import {  Serv }  from 'http-rpc/lib/Serv'
import {  AgentHandler }  from './handler/AgentHandler'
import { AgDB } from './db/AgDB'

const srv = new Serv(['*'], 64 ) // set the size of header

let db = new AgDB()

const ah = new AgentHandler(db)
srv.routeRPC('agent',  ah)

srv.listen(8888)

