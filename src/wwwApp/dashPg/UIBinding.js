
console.log('UI:')

depp.define({'dash':'/api/DashVM.js'})

depp.require(['DOM', 'RPC', 'dash'], init)

function init() {
    console.log('ready')

    const vm = new DashVM()

    const domain = 'www.ubaycap.com'

    // vm.pageViews(domain) // bar chart

    //vm.popular(domain) page count vertical bar chart
    
    //vm.ref(domain)

    //vm.geo(domain)
    //vm.recent(domain)

}