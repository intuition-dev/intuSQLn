
declare var Fingerprint2 // to compile

/**
 * This will download fingerprint
 */
class __gMetrics {

   static _fingerSrc = 'https://cdn.jsdelivr.net/npm/fingerprintjs2@2.1.0/fingerprint2.min.js'

   private _start = Date.now()

   static _url = 'https://1826820696.rsc.cdn77.org'

   constructor(orgCode) {
      
      window.addEventListener("error", function (e) {
         console.log( e.error.message)
      })
      window.addEventListener('unhandledrejection', function (e) {
         console.log( e.reason.message)
       })

      window.onerror = function(message, source, lineno, colno, error) {
         console.log(message)

         return true
      }//

      this._init()
   }//()
   
   private _init() {
      setTimeout(function () {
         this._addScript(__gMetrics._fingerSrc, this.onLoadedFinger)
      },25)
   }

   onLoadedFinger() {
      var options = {fonts: {extendedJsFonts: false}, excludes: {userAgent: true}}  // audio.timeout (default: 1000)

      setTimeout(function () {
         Fingerprint2.get(function (components) {
            console.log(components) // an array of components
         })  
     }, 500)

   }//()

   /**
    *  Send browser, referer, fingerprint, ip(for geo), browser
    *  Also used for RUM
    *  and AMP: reports DOM ready relative to start
    */
   private _metrics() { 
      // send locale
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url + '/metrics')
      //ajax.setRequestHeader("Content-Type", "application/json")
      var obj = {a:'b'}
      ajax.send(JSON.stringify(obj) )
      console.log('sent', JSON.stringify(obj))
   }

   _error(errorObj) {
      // send locale
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
   _addScript(src, callback, attr?, attrValue?, id?) {
      var s = document.createElement('script')
      s.setAttribute('src', src)
      if (attr) s.setAttribute(attr, attrValue)
      if (id) s.id = id
      if (callback) s.onload = callback
      s.async = true // it does it anyway, as the script is async
      document.getElementsByTagName('body')[0].appendChild(s)
   }
   
}//

