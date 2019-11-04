
 // https://michaljanaszek.com/blog/test-website-performance-with-puppeteer

// https://nitayneeman.com/posts/getting-to-know-puppeteer-using-practical-examples/
// https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md

// https://fdalvi.github.io/blog/2018-02-05-puppeteer-network-throttle/


declare var window: any // needed to compile ts

import puppeteer from 'puppeteer'

const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "ii"})

const perfy = require('perfy')


async function run() {
   const browser = await puppeteer.launch()
   const [page] = await browser.pages();

   const client = await page.target().createCDPSession()
   await client.send('Performance.enable')

   // page.on('request', request => console.info(`👉 Request: ${request.url()}`));
   page.on('requestfinished', req => log.info( `${req.url()}` ))


   await page.tracing.start({ path: './trace.json' })
   await page.goto('https://www.ubaycap.com', { waitUntil: 'networkidle0' })
   await page.tracing.stop()

   const performanceTiming = JSON.parse( // this goes to the browsers itself
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    )
   //console.log(performanceTiming)

   const performanceMetrics = await client.send('Performance.getMetrics')
   //log.info(performanceMetrics)

   await browser.close()
}//()

run()
