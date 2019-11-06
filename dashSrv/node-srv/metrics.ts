
import {  ExpressRPC } from "mbake/lib/Serv"
const bodyP = require("body-parser")

import {  MetricsHandler } from "./handler/MetricsHandler"

const exp = new ExpressRPC() 
exp.makeInstance(['*'])

const mh = new MetricsHandler()
exp.appInst.use(bodyP.urlencoded({extended : true}))

exp.appInst.use(function(req,resp, next){
   console.log(req.originalUrl)
   next()
})

exp.appInst.post('/metrics',  function (req, res) {// mh.metrics)
   console.log('.....')
})
exp.appInst.post('/error', mh.error)
exp.appInst.post('/log', mh.log)

exp.listen(3000)

