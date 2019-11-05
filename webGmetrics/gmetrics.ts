

class __gMetrics {


   
   metrics() {
      var ajax = new XMLHttpRequest()
      ajax.open('GET', 'http://localhost:3000/metrics?a=b')
      ajax.send()
   }

}

new __gMetrics().metrics()

