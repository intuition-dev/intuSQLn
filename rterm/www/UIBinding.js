
console.log('UI:')

// var vm = new ViewModel()

depp.require(['poly', 'socketio', 'xterm', 'html2canvas'], function() {
   console.log('ready')
   setup()
}) 

function setup() {
   var term = new Terminal();
   term.open(document.getElementById('terminal'));
   term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')


   // sock
   var socket = io.connect(':3000')
   socket.on('welcome', function(data) {
      addMessage(data.message);

      // Respond with a message including this clients' id sent from the server
      socket.emit('cx', {data: 'foo!', id: data.id})
      console.log(data.id)
   })
   socket.on('time', function(data) {
         addMessage(data.time);
   });
   socket.on('error', console.error.bind(console));
   socket.on('message', console.log.bind(console));
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