
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
   setup()
}) 

function setup() {
    
   Terminal.apply(attach)
   Terminal.apply(fit)
   window.term = new Terminal()
   term.open(document.getElementById('terminal'))
   term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')

   // ws ////////////////////
   const url = 'ws://localhost:8080'
   const socket = new WebSocket(url)
  
   /*
   socket.onopen = () => {
      socket.send('Message From Client') 
   }
   */

   socket.onerror = (error) => {
      console.log(`WebSocket error: ${error}`)
   }
   
   /*
   socket.onmessage = (e) => {
      console.log('msg', e.data)
   }
   */

   //combo
   term.attach(socket)
}

function addMessage(message) {
   var text = document.createTextNode(message),
       el = document.createElement('li'),
       messages = document.getElementById('messages');

   el.appendChild(text);
   messages.appendChild(el);
}

 
// sets the states of the view, such as buttons, click enabled/grayed and others
function pushUIState() {

}

// var vm = new ViewModel()
