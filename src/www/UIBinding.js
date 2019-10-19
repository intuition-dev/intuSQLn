
console.log('UI:')

// var vm = new VideModel()

depp.require(['DOM', 'smoothie'], function() {
   console.log('ready')
   smoot()
}) 

function smoot() {
   var random = new TimeSeries()
   setInterval(function() {
     random.append(new Date().getTime(), Math.random() * 1000);
   }, 1000)

   var chart = new SmoothieChart()
   chart.addTimeSeries(random, 
      { strokeStyle: 'rgba(0, 255, 0, 1)',
       fillStyle: 'rgba(0, 255, 0, 0.2)'
       , lineWidth: 4 })

   chart.streamTo(document.getElementById("chart1"), 1000)


}
 
// sets the states of the view, such as buttons, click enabled/grayed and others
function pushUIState() {

}