
class __gMetrics {

   private _start = Date.now()

   static _url = 'http://localhost:3000'

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

   }//()

   _error(errorObj) {
      // send locale
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url + '/error')
      ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
      ajax.send(JSON.stringify(errorObj))
   }

   /**
    *  Send browser, referer, fingerprint, ip(for geo), browser
    *  Also used for RUM
    *  and AMP: reports DOM ready relative to start
    */
   metrics() { 
      // send locale
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url + '/metrics')
      ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
      var obj = {a:'b'}
      ajax.send(JSON.stringify(obj))
      console.log('sent')
   }

   log(arg) {
      // send locale
      var ajax = new XMLHttpRequest()
      ajax.open('POST', __gMetrics._url + '/log')
      ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
      ajax.send(JSON.stringify(arg))
   }



}//

