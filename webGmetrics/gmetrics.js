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
    };
    __gMetrics.prototype.metrics = function () {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/metrics?a=b');
        ajax.send();
    };
    __gMetrics.prototype.log = function (arg) {
    };
    __gMetrics._url = 'http://localhost:3000';
    return __gMetrics;
}());
