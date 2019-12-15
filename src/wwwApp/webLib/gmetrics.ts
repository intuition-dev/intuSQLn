
declare var Fingerprint2 // to compile
declare var userAgent
declare var requestIdleCallback
declare var ClientJS
declare var TraceKit

/**
 * This will download fingerprint
 */
class __gMetrics {
   //static _fingerSrc = 'https://cdn.jsdelivr.net/npm/fingerprintjs2@2.1.0/fingerprint2.min.js'
   static _clientSrc = 'https://cdn.jsdelivr.net/npm/clientjs@0.1.11/dist/client.min.js'

   static _traceSrc = 'https://cdn.jsdelivr.net/npm/tracekit@0.4.5/tracekit.js'

   static _url1 = 'https://1026491782.rsc.cdn77.org'

   static _url01 = 'http://localhost:3000'

   static _url3 = 'http://185.105.7.112:3000'

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
      setTimeout(function () {
         // https://cdnjs.com/libraries/stacktrace.js
         __gMetrics._addScript(__gMetrics._traceSrc , __gMetrics.onLoadedTrace)
         __gMetrics._addScript(__gMetrics._clientSrc, __gMetrics.onLoadedClient)
         //__gMetrics._addScript(__gMetrics._fingerSrc, __gMetrics.onLoadedFinger)
      },51)
   }//()

   static steps = 0

   static onLoadedTrace() {
      TraceKit.report.subscribe(__gMetrics._sendError) 

      __gMetrics.steps++
   }

   static onLoadedClient() {
      __gMetrics._metrics()

      __gMetrics.steps++
   }

   static XonLoadedFinger() {
      var options = { excludes: {audio: false } // cause waring message in opera
      }
      setTimeout(function () {
            Fingerprint2.get(options, function (components) {
            let fid = Fingerprint2.x64hash128(components.join(''), 31)
            console.log(fid)
            __gMetrics._metrics()
         })  
      }, 200)
   
   }//()

   static met = {}

   /**
    *  Send browser, referer, fingerprint, ip(for geo), browser
    *  Also used for RUM
    *  and AMP: reports DOM ready relative to start
    */
   static _metrics() { 
      var client = new ClientJS()
      __gMetrics.met['domain']= window.location.href.split('?')[0]

      __gMetrics.met['fidc'] = client.getFingerprint()
      __gMetrics.met['bro'] = client.getBrowser()
      __gMetrics.met['os'] = client.getOS()
      if(client.isMobile())
         __gMetrics.met['mobile'] = 1
      else __gMetrics.met['mobile'] = 0 
      __gMetrics.met['tz'] = client.getTimeZone()
      __gMetrics.met['lang'] = client.getLanguage()
      if(client.isIE()) __gMetrics.met['ie'] = 1
         else __gMetrics.met['ie'] = 0

      //__gMetrics.met['fid'] = fid
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
      ajax.open('POST', __gMetrics._url1 + '/metrics1911')
      //ajax.setRequestHeader("Content-Type", "application/json")
      ajax.send(JSON.stringify(__gMetrics.met) )
      console.log('sentMet1124')
      console.log('sent', JSON.stringify(__gMetrics.met))
   }

   static _sendError(errorObj) {
      try {
         if (!errorObj.stack) {
           errorObj.stack = (new Error('make stack')).stack;
           if (errorObj.stack) 
             errorObj.stack = errorObj.stack.toString()
           
         }
      } catch (e) { console.log(e)}
      
      if (typeof errorObj !== 'string') 
         errorObj = JSON.stringify(errorObj)

      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url1 + '/error1911')
      
      //set timeout so metrics maybe?
      setTimeout(function () {
         ajax.send(errorObj)
         console.log(errorObj)
      })
   }//()

   log(arg) {
      let extra={} 

      extra['domain']=  window.location.href

      extra['arg'] = arg
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url1 + '/log')
      
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
      s.async = true // it does it anyway, as the script is async
      document.getElementsByTagName('body')[0].appendChild(s)
   }//()

}//

new __gMetrics()