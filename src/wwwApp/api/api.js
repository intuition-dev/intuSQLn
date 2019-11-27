
console.log('api')

depp.require('RPC', init)

function init()  {
   console.log('rpc')

   const rpc = new httpRPC('http', 'localhost', 3000)

   const pro = rpc.invoke('api', 'DAU', {a:5, b:2})
   pro.then(function(resp) {
      console.log(resp)
   })

}//()