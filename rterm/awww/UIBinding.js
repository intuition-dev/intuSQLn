
console.log('UI:')

depp.define({
   'xterm2': ['https://cdn.jsdelivr.net/npm/xterm@4.1.0/lib/xterm.min.js', 
      'https://cdn.jsdelivr.net/npm/xterm@4.1.0/css/xterm.css',
      'https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.2.1/lib/xterm-addon-fit.min.js',
      'https://cdn.jsdelivr.net/npm/xterm-addon-attach@0.3.0/lib/xterm-addon-attach.min.js'
   ]

})

depp.require(['poly', 'xterm2', 'html2canvas'], function() {
   console.log('ready')
   setupT()
}) 

function setupT() {
   Terminal.apply(attach)
   Terminal.apply(fit)
   window.term = new Terminal()
   term.open(document.getElementById('terminal'))

   // ws ////////////////////
   const url = 'ws://localhost:8080'
   const socket = new WebSocket(url)
   socket.onopen == function(e) {
      console.log(e)
      term.attach(socket)
   }

   socket.onerror = function(error) {
      console.log(error)
   }

   socket.onclose = function(e) {
      console.log('closed', e)
   }
   
}//()


 
// sets the states of the view, such as buttons, click enabled/grayed and others
function pushUIState() {

}

// var vm = new ViewModel()
