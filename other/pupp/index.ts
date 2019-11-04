
// https://nitayneeman.com/posts/getting-to-know-puppeteer-using-practical-examples
// https://michaljanaszek.com/blog/test-website-performance-with-puppeteer

// https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md

// https://fdalvi.github.io/blog/2018-02-05-puppeteer-network-throttle

declare var window: any // needed to compile ts

import puppeteer from 'puppeteer'

const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "ii"})

const perfy = require('perfy')

async function run() {
   const browser = await puppeteer.launch({
      devtools: true,
      headless:true
   })
   const [page] = await browser.pages();
   const client = await page.target().createCDPSession()
   await client.send('Performance.enable')

   page.on('response', response => console.info( ' ', response.url() ))

   await page.goto('https://www.ubaycap.com', { waitUntil: 'networkidle0' })
   await page.waitFor(1000)

   const performanceTiming = await JSON.parse( // this goes to the browsers itself
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    )
   console.log( 'load', performanceTiming['loadEventEnd'] - performanceTiming['navigationStart'])

   const pMetrics = await client.send('Performance.getMetrics')
   const performanceMetrics = aToObj ( pMetrics.metrics )
   console.log( 'firstMP', performanceMetrics['FirstMeaningfulPaint'] - performanceMetrics['NavigationStart'])

   await browser.close()
}//()


function aToObj(a) {
   var rv = {};
   for (let i = 0; i < a.length; ++i) {
      let row = a[i]
      rv[row.name] = row.value
   }
   return rv
}

run()
