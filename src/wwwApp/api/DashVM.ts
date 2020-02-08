

declare var httpRPC
declare var depp
declare var dashAPI

class DashVM {

   rpc

constructor() {
   this.rpc = new httpRPC('http', 'localhost', 3000)
   console.log('DashAPI')
}


pageViews(domain)  {
   const pro = this.rpc.invoke('api', 'pageViews', {a:5, b:2})
   pro.then(function(resp) {
      console.log(resp)
   })

}//()


popular(domain)  {
   const pro = this.rpc.invoke('api', 'popular', {a:5, b:2})
   pro.then(function(resp) {
      console.log(resp)
   })

}//()

ref(domain)  {
   const pro = this.rpc.invoke('api', 'ref', {a:5, b:2})
   pro.then(function(resp) {
      console.log(resp)
   })

}//()


geo(domain)  {
   const pro = this.rpc.invoke('api', 'geo', {a:5, b:2})
   pro.then(function(resp) {
      console.log(resp)
   })

}//()


recent(domain)  {
   const pro = this.rpc.invoke('recent', 'geo', {a:5, b:2})
   pro.then(function(resp) {
      console.log(resp)
   })

}//()

}//class

