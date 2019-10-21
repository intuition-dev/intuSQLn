
console.log('UI:')

// var vm = new ViewModel()

depp.require(['poly', 'socketio', 'xterm', 'html2canvas'], function() {
   console.log('ready')
   setup()
}) 

function setup() {
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