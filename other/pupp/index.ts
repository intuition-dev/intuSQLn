
 // https://michaljanaszek.com/blog/test-website-performance-with-puppeteer

 // second answer https://stackoverflow.com/questions/52969381/how-can-i-capture-all-network-requests-and-full-response-data-when-loading-a-pag

// https://codecept.io/helpers/Puppeteer#configuration
// https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md

// https://fdalvi.github.io/blog/2018-02-05-puppeteer-network-throttle/

import puppeteer from 'puppeteer'

const bunyan = require('bunyan')
const bformat = require('bunyan-format')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "some name"})


async function run() {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    const results = [] // collects all results

    await page.setRequestInterception(true)

    page.on('requestfinished', async (request) => {
        const response = await request.response();

        const responseHeaders = response.headers();

        const information = {
            url: request.url(),
            requestHeaders: request.headers(),
            requestPostData: request.postData(),
            responseHeaders: responseHeaders,
            responseSize: responseHeaders['content-length'],
        };
        results.push(information);

    })

    await page.goto('https://www.ubaycap.com', { waitUntil: 'networkidle0' })
    
    log.info(results)

    await browser.close()
}

run()
