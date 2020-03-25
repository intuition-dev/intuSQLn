"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcryptjs'); // to hash passwords
const jwt = require('jsonwebtoken');
// https://github.com/auth0/node-jsonwebtoken
class JWT {
    hashPass(password, salt) {
        return bcrypt.hashSync(password, salt);
    }
    genSalt() {
        return bcrypt.genSaltSync(10);
    }
}
exports.JWT = JWT;
