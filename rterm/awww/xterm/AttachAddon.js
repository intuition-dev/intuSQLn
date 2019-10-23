"use strict";
var AttachAddon = (function () {
    function AttachAddon(socket, options) {
        this._disposables = [];
        this._socket = socket;
        this._socket.binaryType = 'arraybuffer';
        this._bidirectional = (options && options.bidirectional === false) ? false : true;
    }
    AttachAddon.prototype.activate = function (terminal) {
        var _this = this;
        this._disposables.push(addSocketListener(this._socket, 'message', function (ev) {
            var data = ev.data;
            terminal.write(typeof data === 'string' ? data : new Uint8Array(data));
        }));
        if (this._bidirectional) {
            this._disposables.push(terminal.onData(function (data) { return _this._sendData(data); }));
        }
        this._disposables.push(addSocketListener(this._socket, 'close', function () { return _this.dispose(); }));
        this._disposables.push(addSocketListener(this._socket, 'error', function () { return _this.dispose(); }));
    };
    AttachAddon.prototype.dispose = function () {
        this._disposables.forEach(function (d) { return d.dispose(); });
    };
    AttachAddon.prototype._sendData = function (data) {
        if (this._socket.readyState !== 1) {
            return;
        }
        this._socket.send(data);
    };
    return AttachAddon;
}());
function addSocketListener(socket, type, handler) {
    socket.addEventListener(type, handler);
    return {
        dispose: function () {
            if (!handler) {
                return;
            }
            socket.removeEventListener(type, handler);
        }
    };
}
