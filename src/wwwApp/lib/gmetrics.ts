
declare var Fingerprint2 // to compile
declare var userAgent
declare var requestIdleCallback
declare var ClientJS
declare var TraceKit

/**
 * This will download fingerprint
 */
class __gMetrics {
   static _clientSrc = 'https://cdn.jsdelivr.net/npm/clientjs@0.1.11/dist/client.min.js'

   static _traceSrc = 'https://cdn.jsdelivr.net/npm/tracekit@0.4.5/tracekit.js'

   static _url =  'https://1490415816.rsc.cdn77.org'
   static _url0 = 'http://localhost:3000'

   static _start = Date.now()
   static _dom 

   constructor() {
      // start

      document.addEventListener('DOMContentLoaded', function() {
         __gMetrics._dom  = Date.now()
         __gMetrics._init()
      })
   }//()
   
   static _init() {
      __gMetrics._addScript(__gMetrics._traceSrc , __gMetrics.onLoadedTrace)

      setTimeout(function () { // after dom
         // https://cdnjs.com/libraries/stacktrace.js
         __gMetrics._addScript(__gMetrics._clientSrc, __gMetrics.onLoadedClient)
      },51)
   }//()

   static steps = 0

   static onLoadedTrace() {
      TraceKit.report.subscribe(__gMetrics._sendError) 

      __gMetrics.steps++
      setTimeout(function(){
         // throw new Error('oh oh oh')
      },200)
   }

   static client

   static onLoadedClient() {
      __gMetrics.client = new ClientJS()
      __gMetrics._metrics()

      __gMetrics.steps++
   }

   static met = {}

   /**
    *  Send browser, referer, fingerprint, ip(for geo), browser
    *  Also used for RUM
    *  and AMP: reports DOM ready relative to start
    */
   static _metrics() { 
      __gMetrics.met['domain']= window.location.href.split('?')[0] // deprecated
      __gMetrics.met['url']=  window.location.href

      __gMetrics.met['fidc'] = __gMetrics.client.getFingerprint()
      __gMetrics.met['bro'] = __gMetrics.client.getBrowser()
      __gMetrics.met['os'] = __gMetrics.client.getOS()
      if(__gMetrics.client.isMobile())
         __gMetrics.met['mobile'] = 1
      else __gMetrics.met['mobile'] = 0 
      __gMetrics.met['tz'] = __gMetrics.client.getTimeZone()
      __gMetrics.met['lang'] = __gMetrics.client.getLanguage()
      if(__gMetrics.client.isIE()) __gMetrics.met['ie'] = 1
         else __gMetrics.met['ie'] = 0

      __gMetrics.met['referrer'] = document.referrer
      __gMetrics.met['h']=window.screen.height
      __gMetrics.met['w']=window.screen.width
      __gMetrics.met['title']= document.title
      __gMetrics.met['domTime']= __gMetrics._dom - __gMetrics._start 

      //console.log(__gMetrics.met)
      __gMetrics.sendMet()
   }//() 

   static sendMet() {
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url + '/metrics')
      //ajax.setRequestHeader("Content-Type", "application/json")
      ajax.send(JSON.stringify(__gMetrics.met) )
      console.log('sentMet - v2021')
      //console.log('sent', JSON.stringify(__gMetrics.met))

      // throw new Error("test")
   }

   static _sendError(errorObj) {
      console.log('error')
      try {
         if (!errorObj.stack) {
           errorObj.stack = (new Error('make stack')).stack;
           if (errorObj.stack) 
             errorObj.stack = errorObj.stack.toString()
           
         }
      } catch (e) { console.log(e)}
      
      if (typeof errorObj !== 'string') 
         errorObj = JSON.stringify(errorObj)

      let extra= __gMetrics.met // if we have it, lets get the extra info
      
      extra['error']=  errorObj

      if(__gMetrics.client)
         extra['fidc'] = __gMetrics.client.getFingerprint()

      extra['domain']=  window.location.href // deprecated
      extra['url']=  window.location.href
         
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url + '/error')
      //set timeout so metrics maybe?
      setTimeout(function () {
         ajax.send(JSON.stringify(extra))
      })
   }//()

   log(arg) {
      let extra={} 

      if(__gMetrics.client)
        extra['fidc'] = __gMetrics.client.getFingerprint()
      extra['domain']=  window.location.href // deprecated
      extra['url']=  window.location.href

      if (typeof arg !== 'string') 
         arg = JSON.stringify(arg)

      extra['arg'] = arg
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url + '/log')
      
      ajax.send(JSON.stringify(extra))
      console.log(extra)
   }

   //- eg addScript('bla.js', null, 'api-key', 'key123') 
   static _addScript(src, callback, attr?, attrValue?, id?) {
      var s = document.createElement('script')
      s.setAttribute('src', src)
      if (attr) s.setAttribute(attr, attrValue)
      if (id) s.id = id
      if (callback) s.onload = callback
      document.getElementsByTagName('body')[0].appendChild(s)
   }//()

}//

new __gMetrics()

