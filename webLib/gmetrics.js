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
        this._init();
    }
    __gMetrics.prototype._init = function () {
        setTimeout(function () {
            __gMetrics._addScript(__gMetrics._fingerSrc, __gMetrics.onLoadedFinger);
        }, 25);
    };
    __gMetrics.onLoadedFinger = function () {
        setTimeout(function () {
            Fingerprint2.get(function (components) {
                console.log(components);
                var fid = Fingerprint2.x64hash128(components.join(''), 31);
                console.log(fid);
                __gMetrics._metrics(fid);
            });
        }, 500);
    };
    __gMetrics._metrics = function (fid) {
        var met = {};
        met['fid'] = fid;
        met['lang'] = __gMetrics.lang;
        met['userAgent'] = navigator.userAgent;
        if (true)
            return;
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
    __gMetrics._addScript = function (src, callback, attr, attrValue, id) {
        var s = document.createElement('script');
        s.setAttribute('src', src);
        if (attr)
            s.setAttribute(attr, attrValue);
        if (id)
            s.id = id;
        if (callback)
            s.onload = callback;
        s.async = true;
        document.getElementsByTagName('body')[0].appendChild(s);
    };
    Object.defineProperty(__gMetrics, "lang", {
        get: function () {
            return navigator.language || navigator.userLanguage;
        },
        enumerable: true,
        configurable: true
    });
    __gMetrics._fingerSrc = 'https://cdn.jsdelivr.net/npm/fingerprintjs2@2.1.0/fingerprint2.min.js';
    __gMetrics._url = 'https://1826820696.rsc.cdn77.org';
    return __gMetrics;
}());
new __gMetrics('');
