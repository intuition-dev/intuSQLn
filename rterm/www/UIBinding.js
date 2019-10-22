
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
   // ws ////////////////////
   let socket = new WebSocket("ws://javascript.info")


   if(true) return
   var term = new Terminal();
   term.open(document.getElementById('terminal'));
   term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
   
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
