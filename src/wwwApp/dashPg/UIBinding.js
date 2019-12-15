
console.log('UI:')

depp.define({'dapi':'/api/DashAPI.js'})


depp.require(['DOM', 'RPC', 'dapi'], function() {
    console.log('ready')
}) 
 
// sets the states of the view, such as buttons, click enabled/grayed and others
function pushState() {

}