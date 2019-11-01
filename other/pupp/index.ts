
import puppeteer from 'puppeteer'


(async () => {
   // deploy headless true
   const browser = await puppeteer.launch({
      headless: false, 
      defaultViewport: null,
      devtools: true
   })
   const page = await browser.newPage()
   const client = await page.target().createCDPSession()
   await client.send('Network.enable')

   await client.send('Network.setRequestInterception', { patterns: [{ 
         urlPattern: '*', 
         resourceType: 'Script', 
         interceptionStage: 'HeadersReceived' 
         }
      ]})

   await page.goto('https://www.ubaycap.com')
   await page.screenshot({path: 'XxxX.png'})
  
   await browser.close()
 })()

 // https://medium.com/@jsoverson/using-chrome-devtools-protocol-with-puppeteer-737a1300bac0