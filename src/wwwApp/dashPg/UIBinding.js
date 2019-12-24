
console.log('UI:')

depp.define({'dash':'/api/DashVM.js'})


depp.require(['DOM', 'RPC', 'dash'], function() {
    console.log('ready')
}) 
