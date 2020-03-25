"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const Serv_1 = require("http-rpc/lib/Serv");
class AAHandler extends Serv_1.BaseRPCMethodHandler {
    constructor(sdb) {
        super(1, 1);
        this.log = new terse_b_1.TerseB(this.constructor.name);
        this.sdb = sdb;
    }
    async _addUser(email, pswd) {
    }
    tokenCheckNRenew(token) { }
    tokenGet(email, pswd) {
        //  If email = 'admin', else go to redis
        // else return ?
    }
    _tokenIsUser() { }
    _tokenIsAdmin() { }
    tokenLogOut() { }
    adminAddUser(email, pswd) {
    }
    adminChangeUserEmail(oldEmail, newEmail) { }
    adminListUsers() { }
    pswdEmailCode(email) { }
    pswdResetIfMatch(email, code, pswd) { }
}
exports.AAHandler = AAHandler;
