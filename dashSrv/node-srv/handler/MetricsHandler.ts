
const URL = require('url')

const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "Metrics handler"})


export class MetricsHandler {

   handle(req, resp) {

      resp.send('OK')

      let params = URL.parse(req.url, true).query
      log.info(params)

         
   }//()

}