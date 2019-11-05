var __gMetrics = (function () {
    function __gMetrics() {
        this._start = Date.now();
    }
    __gMetrics.prototype.constructor2 = function () {
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
    };
    __gMetrics.prototype.metrics = function () {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/metrics?a=b');
        ajax.send();
    };
    return __gMetrics;
}());
