
console.log('good metrics')

function _gmetrics() {
   var ajax = new XMLHttpRequest()
   ajax.open('GET', 'http://localhost:3000/metrics?a=b')
   ajax.send()
}

setTimeout(function(){
   _gmetrics()
},50)

