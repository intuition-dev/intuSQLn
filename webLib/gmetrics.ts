
declare var Fingerprint2 // to compile
declare var userAgent
declare var requestIdleCallback
/**
 * This will download fingerprint
 */
class __gMetrics {
   static _fingerSrc = 'https://cdn.jsdelivr.net/npm/fingerprintjs2@2.1.0/fingerprint2.min.js'
   static _clientSrc = 'https://cdn.jsdelivr.net/npm/clientjs@0.1.11/dist/client.min.js'

   static _url = 'https://1826820696.rsc.cdn77.org'

   static _start = Date.now()
   static _dom 

   constructor(orgCode) {
      // 
      window.addEventListener("error", function (e) {
         console.log( e.error.message)
         __gMetrics._error('error',e)
      })
      window.addEventListener('unhandledrejection', function (e) {
         console.log( e.reason.message)
         __gMetrics._error('unhandled', e)
       })
      window.onerror = function(message, source, lineno, colno, error) {
         console.log(message)
         var e = {}
         e['message']=message
         e['source']=source
         e['lineno']=lineno
         e['error']=error
         __gMetrics._error('on', e)
         return true
      }//

      // start
      document.addEventListener('DOMContentLoaded', function() {
         __gMetrics._dom  = Date.now()
         this._init()
      })
   }//()
   
   private _init() {
      setTimeout(function () {
         __gMetrics._addScript(__gMetrics._fingerSrc, __gMetrics.onLoadedFinger)
      },25)
   }

   static onLoadedFinger() {
      if (window.requestIdleCallback) {
         requestIdleCallback(function () {
             Fingerprint2.get(function (components) {
               console.log(components)
               let fid = Fingerprint2.x64hash128(components.join(''), 31)
               console.log(fid, Date.now())
               __gMetrics._metrics(fid)
            })
         })
     } else {
         setTimeout(function () {
             Fingerprint2.get(function (components) {
               console.log(components)
               let fid = Fingerprint2.x64hash128(components.join(''), 31)
               console.log(fid)
               __gMetrics._metrics(fid)
            })  
         }, 500)
     }//else
   }//()

   static met = {}

   /**
    *  Send browser, referer, fingerprint, ip(for geo), browser
    *  Also used for RUM
    *  and AMP: reports DOM ready relative to start
    */
   static _metrics(fid, idleTime?) { 
      __gMetrics.met['fid'] = fid
      __gMetrics.met['lang'] = __gMetrics.lang
      __gMetrics.met['userAgent'] = navigator.userAgent
      __gMetrics.met['referrer'] = document.referrer
      __gMetrics.met['h']=window.screen.height
      __gMetrics.met['w']=window.screen.width
      __gMetrics.met['url']= window.location.href.split('?')[0]
      __gMetrics.met['idleTime']= idleTime
      __gMetrics.met['domTime']= __gMetrics._dom 
      __gMetrics.met['startTime']= __gMetrics._start 
   
      // also for error
      // is mobile
      // is tablet
      // ip, zip, country
      // do seo search for title via api

      // perf trace route

      // percent chance of receiving

      if(true) return
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url + '/metrics')
      //ajax.setRequestHeader("Content-Type", "application/json")
      ajax.send(JSON.stringify(__gMetrics.met) )
      console.log('sent', JSON.stringify(__gMetrics.met))
   }

   static _error(type, errorObj) {
      // is error new
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url + '/error')
      //ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
      ajax.send(JSON.stringify(errorObj))
   }

   log(arg) {
      // send locale
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url + '/log')
      //ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
      ajax.send(JSON.stringify(arg))
   }

   //- eg addScript('bla.js', null, 'api-key', 'key123') when they want you to use the tag: so you can in your own sequence
   static _addScript(src, callback, attr?, attrValue?, id?) {
      var s = document.createElement('script')
      s.setAttribute('src', src)
      if (attr) s.setAttribute(attr, attrValue)
      if (id) s.id = id
      if (callback) s.onload = callback
      s.async = true // it does it anyway, as the script is async
      document.getElementsByTagName('body')[0].appendChild(s)
   }

   static get lang() {
      return navigator.language || navigator.userLanguage
    }
}//

new __gMetrics('')

