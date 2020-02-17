
const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "main"})

import {  Serv }  from 'http-rpc/lib/Serv'

import {  AgentHandler }  from './handler/AgentHandler'

const srv = new Serv(['*']) 


const ah = new AgentHandler(null);
srv.routeRPC('agent',  ah)


srv.listen(8888)

