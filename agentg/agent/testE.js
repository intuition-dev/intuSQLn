"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("./lib/Email");
const em = new Email_1.Email();
var to_name = 'Vic', to_email = 'vic@eml.cc', from_name = 'Al', reply_to = 'al@gore.com', subject = 'oh hi', body = 'Now this';
em.send('gmail', 'tone', 'user_4aWUwDyNvJDTKwiCEtCgz', to_name, to_email, from_name, reply_to, subject, body);
const SysAgent_1 = require("./lib/SysAgent");
SysAgent_1.SysAgent.statsSmall().then(function (data) {
    console.log(data);
});
