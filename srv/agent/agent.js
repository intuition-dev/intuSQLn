#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commandLineArgs = require("command-line-args");
const SysAgent_1 = require("./lib/SysAgent");
const FileOpsExtra_1 = require("./lib/FileOpsExtra");
const ver = "v1.0.0";
FileOpsExtra_1.VersionNag.isCurrent('mbake', ver).then(function (isCurrent_) {
    try {
        if (!isCurrent_)
            console.log('There is a newer version of mbake CLI, please update.');
    }
    catch (err) {
        console.log(err);
    }
});
const cwd = process.cwd();
function version() {
    console.info('mbake CLI version: ' + ver);
}
function help() {
    console.info();
    console.info('mbake CLI version: ' + ver);
    console.info();
    console.info('Usage:');
    console.info('  List ports in use w/ process ID:                            mbake -p');
    console.info(' Full docs: http://www.INTUITION.DEV');
    console.info();
}
const optionDefinitions = [
    { name: 'agent', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'ports', alias: 'p', type: Boolean },
];
const argsParsed = commandLineArgs(optionDefinitions);
let arg = argsParsed.mbake;
console.info();
if (arg) {
    arg = FileOpsExtra_1.Dirs.slash(arg);
    if (arg.startsWith('/')) {
    }
    else if (arg.startsWith('..')) {
        arg = arg.substring(2);
        let d = cwd;
        d = FileOpsExtra_1.Dirs.slash(d);
        let n = d.lastIndexOf('/');
        d = d.substring(0, n);
        arg = d + arg;
    }
    else if (arg.startsWith('.')) {
        arg = cwd;
    }
    else {
        arg = cwd + '/' + arg;
    }
}
function ports() {
    SysAgent_1.SysAgent.ports();
}
if (argsParsed.version)
    version();
else if (argsParsed.help)
    help();
else if (argsParsed.ports)
    ports();
else
    (!arg);
help();
