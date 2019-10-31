
console.log('x')


function gmetrics() {
   var ajax = new XMLHttpRequest()
   ajax.open('GET', 'myservice/username?id=some-unique-id')
   ajax.send()
}

gmetrics()