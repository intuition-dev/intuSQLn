
console.log('UI:')

depp.define({'dash':'/api/DashVM.js'})


depp.require(['DOM', 'RPC', 'dash'], function() {
    console.log('ready')
}) 
 
// sets the states of the view, such as buttons, click enabled/grayed and others
function pushState() {

}