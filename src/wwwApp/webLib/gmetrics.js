var __gMetrics = (function () {
    function __gMetrics() {
        document.addEventListener('DOMContentLoaded', function () {
            __gMetrics._dom = Date.now();
            __gMetrics._init();
        });
    }
    __gMetrics._init = function () {
        setTimeout(function () {
            __gMetrics._addScript(__gMetrics._traceSrc, __gMetrics.onLoadedTrace);
            __gMetrics._addScript(__gMetrics._clientSrc, __gMetrics.onLoadedClient);
            __gMetrics._addScript(__gMetrics._fingerSrc, __gMetrics.onLoadedFinger);
        }, 51);
    };
    __gMetrics.onLoadedTrace = function () {
        TraceKit.report.subscribe(__gMetrics._sendError);
        __gMetrics.steps++;
    };
    __gMetrics.onLoadedClient = function () {
        __gMetrics.steps++;
    };
    __gMetrics.onLoadedFinger = function () {
        var options = { excludes: { audio: false }
        };
        setTimeout(function () {
            Fingerprint2.get(options, function (components) {
                var fid = Fingerprint2.x64hash128(components.join(''), 31);
                console.log(fid);
                __gMetrics._metrics(fid);
            });
        }, 200);
    };
    __gMetrics._metrics = function (fid) {
        var client = new ClientJS();
        __gMetrics.met['domain'] = window.location.href.split('?')[0];
        __gMetrics.met['fidc'] = client.getFingerprint();
        __gMetrics.met['bro'] = client.getBrowser();
        __gMetrics.met['os'] = client.getOS();
        if (client.isMobile())
            __gMetrics.met['mobile'] = 1;
        else
            __gMetrics.met['mobile'] = 0;
        __gMetrics.met['tz'] = client.getTimeZone();
        __gMetrics.met['lang'] = client.getLanguage();
        if (client.isIE())
            __gMetrics.met['ie'] = 1;
        else
            __gMetrics.met['ie'] = 0;
        __gMetrics.met['fid'] = fid;
        __gMetrics.met['referrer'] = document.referrer;
        __gMetrics.met['h'] = window.screen.height;
        __gMetrics.met['w'] = window.screen.width;
        __gMetrics.met['title'] = document.title;
        __gMetrics.met['domTime'] = __gMetrics._dom - __gMetrics._start;
        __gMetrics.sendMet();
    };
    __gMetrics.sendMet = function () {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url1 + '/metrics1911');
        ajax.send(JSON.stringify(__gMetrics.met));
        console.log('sentMet1124');
        console.log('sent', JSON.stringify(__gMetrics.met));
    };
    __gMetrics._sendError = function (errorObj) {
        try {
            if (!errorObj.stack) {
                errorObj.stack = (new Error('make stack')).stack;
                if (errorObj.stack)
                    errorObj.stack = errorObj.stack.toString();
            }
        }
        catch (e) {
            console.log(e);
        }
        if (typeof errorObj !== 'string')
            errorObj = JSON.stringify(errorObj);
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url1 + '/error1911');
        setTimeout(function () {
            ajax.send(errorObj);
            console.log(errorObj);
        });
    };
    __gMetrics.prototype.log = function (arg) {
        var extra = {};
        extra['domain'] = window.location.href;
        extra['arg'] = arg;
        var ajax = new XMLHttpRequest();
        ajax.open('POST', __gMetrics._url1 + '/log');
        ajax.send(JSON.stringify(extra));
        console.log(extra);
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
    __gMetrics._fingerSrc = 'https://cdn.jsdelivr.net/npm/fingerprintjs2@2.1.0/fingerprint2.min.js';
    __gMetrics._clientSrc = 'https://cdn.jsdelivr.net/npm/clientjs@0.1.11/dist/client.min.js';
    __gMetrics._traceSrc = 'https://cdn.jsdelivr.net/npm/tracekit@0.4.5/tracekit.js';
    __gMetrics._url1 = 'https://1026491782.rsc.cdn77.org';
    __gMetrics._url01 = 'http://localhost:3000';
    __gMetrics._url3 = 'http://185.105.7.112:3000';
    __gMetrics._start = Date.now();
    __gMetrics.steps = 0;
    __gMetrics.met = {};
    return __gMetrics;
}());
new __gMetrics();
