
console.log('api')

depp.require('RPC', init)

function init()  {
   console.log('rpc')

   const rpc = new httpRPC('http', 'localhost', 8888)

   const pro = rpc.invoke('api', 'pageOne', 'multiply', {a:5, b:2})
   pro.then(function(resp) {
      console.log(resp)
   })

}//()