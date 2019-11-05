

class __gMetrics {

   private _start = Date.now()


   constructor() {


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


   metrics() {
      var ajax = new XMLHttpRequest()
      ajax.open('GET', 'http://localhost:3000/metrics?a=b')
      ajax.send()
   }

}

new __gMetrics().metrics()

