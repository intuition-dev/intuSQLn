"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const Serv_1 = require("http-rpc/lib/Serv");
var jwt = require('jsonwebtoken');
class AAHandler extends Serv_1.BaseRPCMethodHandler {
    constructor() {
        super(1, 1);
        this.log = new terse_b_1.TerseB(this.constructor.name);
    }
    tokenGet(email, pswd) {
        //  If email = 'admin', else go to redis
        // else return ?
    }
    _tokenIsUser() { }
    _tokenIsAdmin() { }
    tokenLogOut() { }
    adminAddUser(email, pswd) {
    }
    adminChangeUser(oldEmail, newEmail) { }
    adminListUsers() { }
    adminDisableUser(email) { }
    adminEnableUser(email) { }
    uPswdEmailCode(email) { }
    uPswdResetIfMatch(email, code, pswd) { }
}
exports.AAHandler = AAHandler;
