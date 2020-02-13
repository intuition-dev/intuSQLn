#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commandLineArgs = require("command-line-args");
const SysAgent_1 = require("./lib/SysAgent");
const FileOpsExtra_1 = require("./lib/FileOpsExtra");
const gitdown_1 = require("./lib/gitdown");
const ver = "v1.0.5";
FileOpsExtra_1.VersionNag.isCurrent('agentg', ver).then(function (isCurrent_) {
    try {
        if (!isCurrent_)
            console.log('There is a newer version of agentg CLI, please update.');
    }
    catch (err) {
        console.log(err);
    }
});
const cwd = process.cwd();
function version() {
    console.info('agentg CLI version: ' + ver);
}
function help() {
    console.info();
    console.info('agentg CLI version: ' + ver);
    console.info();
    console.info('Usage:');
    console.info('  To download branch from git, in folder with gitdown.yaml: agentg --gitDown .');
    console.info('     passing the git password of gitdown user');
    console.info();
    console.info('  List ports in use w/ process ID:                          agentg -p');
    console.info();
    console.info(' Full docs: http://www.INTUITION.DEV');
    console.info();
}
const optionDefinitions = [
    { name: 'agent', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'gitDown', type: Boolean },
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
function git(arg) {
    let gg = new gitdown_1.GitDown(arg);
}
if (argsParsed.version)
    version();
else if (argsParsed.help)
    help();
else if (argsParsed.ports)
    ports();
else if (argsParsed.gitDown)
    git(arg);
else
    (!arg);
help();
