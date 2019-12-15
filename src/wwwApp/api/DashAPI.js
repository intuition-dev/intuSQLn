console.log('api');
var DashAPI = (function () {
    function DashAPI() {
        this.rpc = new httpRPC('http', 'localhost', 3000);
        this.pageViews('x');
    }
    DashAPI.prototype.pageViews = function (domain) {
        var pro = this.rpc.invoke('api', 'pageViews', { a: 5, b: 2 });
        pro.then(function (resp) {
            console.log(resp);
        });
    };
    DashAPI.prototype.popular = function (domain) {
        var pro = this.rpc.invoke('api', 'popular', { a: 5, b: 2 });
        pro.then(function (resp) {
            console.log(resp);
        });
    };
    DashAPI.prototype.ref = function (domain) {
        var pro = this.rpc.invoke('api', 'ref', { a: 5, b: 2 });
        pro.then(function (resp) {
            console.log(resp);
        });
    };
    DashAPI.prototype.geo = function (domain) {
        var pro = this.rpc.invoke('api', 'geo', { a: 5, b: 2 });
        pro.then(function (resp) {
            console.log(resp);
        });
    };
    DashAPI.prototype.recent = function (domain) {
        var pro = this.rpc.invoke('recent', 'geo', { a: 5, b: 2 });
        pro.then(function (resp) {
            console.log(resp);
        });
    };
    return DashAPI;
}());
dashAPI = new DashAPI();
