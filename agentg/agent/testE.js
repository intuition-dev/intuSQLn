"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Email_1 = require("./bl/Email");
const em = new Email_1.Email();
var to_name = 'Vic', to_email = 'vic@eml.cc', from_name = 'Al', from_email = 'al@gore.com', subject = 'oh hi', body = 'Now this';
em.send('gmail', 'tone', 'user_4aWUwDyNvJDTKwiCEtCgz', to_name, to_email, from_name, from_email, subject, body);
