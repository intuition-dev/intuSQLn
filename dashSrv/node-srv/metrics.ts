
import {  ExpressRPC } from "mbake/lib/Serv"

const URL = require('url')

const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "Base"})


log.info('ok')

const express = require('express')
const app = express()
const port = 3000


app.get('/metrics', (req, res) => { 
   res.send('OK')
   
   let params = URL.parse(req.url, true).query
   log.info(params)
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))