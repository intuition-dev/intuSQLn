
console.log('UI:')

// var vm = new ViewModel()

depp.require(['poly', 'xterm', 'html2canvas'], function() {
   console.log('ready')
   setup()
}) 

function setup() {
   var term = new Terminal();
   term.open(document.getElementById('terminal'));
   term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')

   // ws ////////////////////

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