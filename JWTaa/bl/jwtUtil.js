"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
// https://github.com/auth0/node-jsonwebtoken
class JWT {
    guid() {
        return uuid();
    }
}
exports.JWT = JWT;
