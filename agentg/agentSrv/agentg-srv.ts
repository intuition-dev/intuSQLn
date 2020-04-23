// All rights reserved by INTUITION.DEV |  Cekvenich, licensed under LGPL 3.0

// error 431 : https://stackoverflow.com/questions/32763165/node-js-http-get-url-length-limitation


import {  Serv }  from 'http-rpc/lib/Serv'
import {  AgentHandler }  from './handler/AgentHandler'
import { AgDB } from './db/AgDB'
import { DashHandler } from './handler/DashHandler'

const srv = new Serv(['*'], 16 *1024 ) // set the size of header

let db = new AgDB()

const ah = new AgentHandler(db)
const dh = new DashHandler(db)
srv.routeRPC('agent',  ah)
srv.routeRPC('dash',  dh)

srv.listen(8888)

