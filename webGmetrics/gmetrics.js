var __gMetrics = (function () {
    function __gMetrics(orgCode) {
        this._start = Date.now();
        window.addEventListener("error", function (e) {
            console.log(e.error.message);
        });
        window.addEventListener('unhandledrejection', function (e) {
            console.log(e.reason.message);
        });
        window.onerror = function (message, source, lineno, colno, error) {
            console.log(message);
            return true;
        };
    }
    __gMetrics.prototype._error = function (errorObj) {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/error');
        ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        ajax.send(JSON.stringify(errorObj));
    };
    __gMetrics.prototype.metrics = function () {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/metrics');
        ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var obj = { a: 'b' };
        ajax.send(JSON.stringify(obj));
        console.log('sent');
    };
    __gMetrics.prototype.log = function (arg) {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/log');
        ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        ajax.send(JSON.stringify(arg));
    };
    __gMetrics._url = 'http://localhost:3000';
    return __gMetrics;
}());
