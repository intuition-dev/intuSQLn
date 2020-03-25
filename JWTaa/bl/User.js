"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSDB_1 = require("./BaseSDB");
const fetch = require('make-fetch-happen');
class User extends BaseSDB_1.BaseSDB {
    constructor() {
        super({}, '');
        this.prefix = '/users/';
        this.jwtSharedSecret = '123';
        this.salt = '123';
        this._setSalt();
    }
    async _initSalt() {
        await this.writeOne(('/salt/salt'), { salt: this.genSalt() });
    }
    async _setSalt() {
        let dat = await this.readOne('/salt/salt');
        this.salt = dat['salt'];
    }
    async adminWriteUser(email, pswd) {
        if (!this.salt)
            throw new Error('no salt');
        const hpswd = this.hashPass(pswd, this.salt);
        await this.writeOne(this.prefix + email, { pswd: hpswd, email: email });
    }
    async checkUser(email, pswd) {
        if (!this.salt)
            throw new Error('no salt');
        const hpswd = this.hashPass(pswd, this.salt);
        let dat = await this.readOne(this.prefix + email);
        const hpswd2 = dat['pswd'];
        return hpswd == hpswd2;
    }
    async listUsers() {
        let users = [];
        let usersO = await this.list(this.prefix);
        for (let obj in usersO) {
            users.push(obj['email']);
        }
        return users;
    }
    pswdEmailCode(email) {
    }
    pswdResetIfMatch(email, guessCode, pswd) {
    }
} //class
exports.User = User;
