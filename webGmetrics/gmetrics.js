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
    __gMetrics.prototype.metrics = function () {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/metrics');
        var obj = { a: 'b' };
        ajax.send(JSON.stringify(obj));
        console.log('sent', JSON.stringify(obj));
    };
    __gMetrics.prototype._error = function (errorObj) {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/error');
        ajax.send(JSON.stringify(errorObj));
    };
    __gMetrics.prototype.log = function (arg) {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/log');
        ajax.send(JSON.stringify(arg));
    };
    __gMetrics._url = 'http://localhost:3000';
    return __gMetrics;
}());
