var __gMetrics = (function() {
    function __gMetrics() {
        document.addEventListener('DOMContentLoaded', function() {
            __gMetrics._dom = Date.now();
            __gMetrics._init();
        });
    }
    __gMetrics._init = function() {
        __gMetrics._addScript(__gMetrics._traceSrc, __gMetrics.onLoadedTrace);
        setTimeout(function() {
            __gMetrics._addScript(__gMetrics._clientSrc, __gMetrics.onLoadedClient);
        }, 51);
    };
    __gMetrics.onLoadedTrace = function() {
        TraceKit.report.subscribe(__gMetrics._sendError);
        __gMetrics.steps++;
        setTimeout(function() {}, 200);
    };
    __gMetrics.onLoadedClient = function() {
        __gMetrics.client = new ClientJS();
        __gMetrics._metrics();
        __gMetrics.steps++;
    };
    __gMetrics._metrics = function() {
        __gMetrics.met['domain'] = window.location.href.split('?')[0];
        __gMetrics.met['url'] = window.location.href;
        __gMetrics.met['fidc'] = __gMetrics.client.getFingerprint();
        __gMetrics.met['bro'] = __gMetrics.client.getBrowser();
        __gMetrics.met['os'] = __gMetrics.client.getOS();
        if (__gMetrics.client.isMobile())
            __gMetrics.met['mobile'] = 1;
        else
            __gMetrics.met['mobile'] = 0;
        __gMetrics.met['tz'] = __gMetrics.client.getTimeZone();
        __gMetrics.met['lang'] = __gMetrics.client.getLanguage();
        if (__gMetrics.client.isIE())
            __gMetrics.met['ie'] = 1;
        else
            __gMetrics.met['ie'] = 0;
        __gMetrics.met['referrer'] = document.referrer;
        __gMetrics.met['h'] = window.screen.height;
        __gMetrics.met['w'] = window.screen.width;
        __gMetrics.met['title'] = document.title;
        __gMetrics.met['domTime'] = __gMetrics._dom - __gMetrics._start;
        __gMetrics.sendMet();
    };
    __gMetrics.sendMet = function() {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/metrics');
        ajax.send(JSON.stringify(__gMetrics.met));
        console.log('sentMet - v2021');
    };
    __gMetrics._sendError = function(errorObj) {
        console.log('error');
        try {
            if (!errorObj.stack) {
                errorObj.stack = (new Error('make stack')).stack;
                if (errorObj.stack)
                    errorObj.stack = errorObj.stack.toString();
            }
        } catch (e) {
            console.log(e);
        }
        if (typeof errorObj !== 'string')
            errorObj = JSON.stringify(errorObj);
        var extra = __gMetrics.met;
        extra['error'] = errorObj;
        if (__gMetrics.client)
            extra['fidc'] = __gMetrics.client.getFingerprint();
        extra['domain'] = window.location.href;
        extra['url'] = window.location.href;
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/error');
        setTimeout(function() {
            ajax.send(JSON.stringify(extra));
        });
    };
    __gMetrics.prototype.log = function(arg) {
        var extra = {};
        if (__gMetrics.client)
            extra['fidc'] = __gMetrics.client.getFingerprint();
        extra['domain'] = window.location.href;
        extra['url'] = window.location.href;
        if (typeof arg !== 'string')
            arg = JSON.stringify(arg);
        extra['arg'] = arg;
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url + '/log');
        ajax.send(JSON.stringify(extra));
        console.log(extra);
    };
    __gMetrics._addScript = function(src, callback, attr, attrValue, id) {
        var s = document.createElement('script');
        s.setAttribute('src', src);
        if (attr)
            s.setAttribute(attr, attrValue);
        if (id)
            s.id = id;
        if (callback)
            s.onload = callback;
        document.getElementsByTagName('body')[0].appendChild(s);
    };
    // todo: replace client with //cdn.jsdelivr.net/npm/fingerprintjs2@<VERSION>/dist/fingerprint2.min.js
    // https://cdnjs.com/libraries/stacktrace.js
    __gMetrics._clientSrc = 'https://cdn.jsdelivr.net/npm/clientjs@0.1.11/dist/client.min.js';
    __gMetrics._traceSrc = 'https://cdn.jsdelivr.net/npm/tracekit@0.4.5/tracekit.js';
    __gMetrics._url = 'https://1490415816.rsc.cdn77.org';
    __gMetrics._url0 = 'http://localhost:3000';
    __gMetrics._start = Date.now();
    __gMetrics.steps = 0;
    __gMetrics.met = {};
    return __gMetrics;
}());
new __gMetrics();