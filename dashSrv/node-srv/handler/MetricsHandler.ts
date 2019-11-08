
const URL = require('url')

const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "Metrics handler"})

log.info('hand')

export class MetricsHandler {
  
   // also for error
   // is mobile
   // is tablet
   // ip, zip, country
   // do seo search for title via api

   // perf trace route

   // percent chance of receiving
   
   metrics(req, resp) {// RUM, APM, 
      //locale

      let params = req.body
      log.info(params)
      resp.send('OK')
         
   }//()
   
   error(req, resp) {

      resp.send('OK')

      let params = req.body
      log.info(params)
         
   }//()
   
   log(req, resp) {
      resp.send('OK')

      let params = req.body
      log.info(params)
         
   }//()

}