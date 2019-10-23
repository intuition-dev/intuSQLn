
console.log('UI:')

// var vm = new ViewModel()

depp.require(['DOM', 'smoothie', 'raphael', 'justgage'], function() {
   console.log('ready')
   smoot()
}) 

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