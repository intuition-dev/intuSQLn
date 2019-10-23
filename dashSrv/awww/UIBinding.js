
console.log('UI:')

// var vm = new ViewModel()

depp.require(['poly', 'DOM', 'RPC', 'smoothie', 'raphael', 'justgage'], function() {
   console.log('ready')
   smoot()
   data()
}) 

function data() {

   const rpc = new httpRPC('http', 'localhost', 8888)

   const pro = rpc.invoke('dash', 'dash', 'dash', {})
   pro.then(function(resp) {
     console.log(resp)
   })   

}

function smoot() {
   var ts1 = new TimeSeries()
   setInterval(function() {
      ts1.append(new Date().getTime(), Math.random() * 1000)
   }, 1000)

   var chart1 = new SmoothieChart()
   chart1.addTimeSeries(ts1, 
      { strokeStyle: 'rgba(0, 255, 0, 1)',
       fillStyle: 'rgba(0, 255, 0, 0.2)'
       , lineWidth: 4 })

   chart1.streamTo(document.getElementById('chart1'), 1000)

   //g
   var g1 = new JustGage({
      id: 'gag1',
      value: 67,
      min: 0,
      max: 100,
    })

}
 
// sets the states of the view, such as buttons, click enabled/grayed and others
function pushUIState() {

}