var __gMetrics = (function () {
    function __gMetrics(orgCode) {
        __gMetrics._orgCode = orgCode;
        window.addEventListener("error", function (e) {
            console.log(e.error.message);
            __gMetrics._error('error', e);
        });
        window.addEventListener('unhandledrejection', function (e) {
            console.log(e.reason.message);
            __gMetrics._error('unhandled', e);
        });
        window.onerror = function (message, source, lineno, colno, error) {
            console.log(message);
            var e = {};
            e['message'] = message;
            e['source'] = source;
            e['lineno'] = lineno;
            e['error'] = error;
            __gMetrics._error('on', e);
            return true;
        };
        document.addEventListener('DOMContentLoaded', function () {
            __gMetrics._dom = Date.now();
            this._init();
        });
    }
    __gMetrics.prototype._init = function () {
        setTimeout(function () {
            __gMetrics._addScript(__gMetrics._fingerSrc, __gMetrics.onLoadedFinger);
        }, 25);
    };
    __gMetrics.onLoadedFinger = function () {
        if (window.requestIdleCallback) {
            requestIdleCallback(function () {
                Fingerprint2.get(function (components) {
                    console.log(components);
                    var fid = Fingerprint2.x64hash128(components.join(''), 31);
                    console.log(fid, Date.now());
                    __gMetrics._metrics(fid);
                });
            });
        }
        else {
            setTimeout(function () {
                Fingerprint2.get(function (components) {
                    console.log(components);
                    var fid = Fingerprint2.x64hash128(components.join(''), 31);
                    console.log(fid);
                    __gMetrics._metrics(fid);
                });
            }, 500);
        }
    };
    __gMetrics._metrics = function (fid, idleTime) {
        __gMetrics.met['orgCode'] = __gMetrics._orgCode;
        __gMetrics.met['fid'] = fid;
        __gMetrics.met['lang'] = __gMetrics.lang;
        __gMetrics.met['userAgent'] = navigator.userAgent;
        __gMetrics.met['referrer'] = document.referrer;
        __gMetrics.met['h'] = window.screen.height;
        __gMetrics.met['w'] = window.screen.width;
        __gMetrics.met['url'] = window.location.href.split('?')[0];
        __gMetrics.met['idleTime'] = idleTime;
        __gMetrics.met['domTime'] = __gMetrics._dom;
        __gMetrics.met['startTime'] = __gMetrics._start;
        console.log(__gMetrics.met);
        if (true)
            return;
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/metrics');
        ajax.send(JSON.stringify(__gMetrics.met));
        console.log('sent', JSON.stringify(__gMetrics.met));
    };
    __gMetrics._error = function (type, errorObj) {
        var err = {};
        err['met'] = __gMetrics.met;
        err['type'] = type;
        err['error'] = errorObj;
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/error');
        ajax.send(JSON.stringify(err));
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
    __gMetrics._clientSrc = 'https://cdn.jsdelivr.net/npm/clientjs@0.1.11/dist/client.min.js';
    __gMetrics._url = 'https://1826820696.rsc.cdn77.org';
    __gMetrics._start = Date.now();
    __gMetrics.met = {};
    return __gMetrics;
}());
new __gMetrics('xxx');
