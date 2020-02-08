var DashVM = (function () {
    function DashVM() {
        this.rpc = new httpRPC('http', 'localhost', 3000);
        console.log('DashAPI');
    }
    DashVM.prototype.pageViews = function (domain) {
        var pro = this.rpc.invoke('api', 'pageViews', { a: 5, b: 2 });
        pro.then(function (resp) {
            console.log(resp);
        });
    };
    DashVM.prototype.popular = function (domain) {
        var pro = this.rpc.invoke('api', 'popular', { a: 5, b: 2 });
        pro.then(function (resp) {
            console.log(resp);
        });
    };
    DashVM.prototype.ref = function (domain) {
        var pro = this.rpc.invoke('api', 'ref', { a: 5, b: 2 });
        pro.then(function (resp) {
            console.log(resp);
        });
    };
    DashVM.prototype.geo = function (domain) {
        var pro = this.rpc.invoke('api', 'geo', { a: 5, b: 2 });
        pro.then(function (resp) {
            console.log(resp);
        });
    };
    DashVM.prototype.recent = function (domain) {
        var pro = this.rpc.invoke('recent', 'geo', { a: 5, b: 2 });
        pro.then(function (resp) {
            console.log(resp);
        });
    };
    return DashVM;
}());
