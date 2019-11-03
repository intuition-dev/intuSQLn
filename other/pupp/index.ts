

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


(async () => {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    const results = []; // collects all results

    let paused = false;
    let pausedRequests = [];

    const nextRequest = () => { // continue the next request or "unpause"
        if (pausedRequests.length === 0) {
            paused = false;
        } else {
            // continue first request in "queue"
            (pausedRequests.shift())(); // calls the request.continue function
        }
    };

    await page.setRequestInterception(true);
    page.on('request', request => {
        if (paused) {
            pausedRequests.push(() => request.continue());
        } else {
            paused = true; // pause, as we are processing a request now
            request.continue();
        }
    });

    page.on('requestfinished', async (request) => {
        const response = await request.response();

        const responseHeaders = response.headers();
        let responseBody;
        if (request.redirectChain().length === 0) {
            // body can only be access for non-redirect responses
            responseBody = await response.buffer();
        }

        const information = {
            url: request.url(),
            requestHeaders: request.headers(),
            requestPostData: request.postData(),
            responseHeaders: responseHeaders,
            responseSize: responseHeaders['content-length'],
            responseBody,
        };
        results.push(information);

        nextRequest(); // continue with next request
    });
    page.on('requestfailed', (request) => {
        // handle failed request
        nextRequest();
    });

    await page.goto('...', { waitUntil: 'networkidle0' });
    
    log.info(results)

    await browser.close();
})();
