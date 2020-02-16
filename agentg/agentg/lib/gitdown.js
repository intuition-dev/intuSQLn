"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
const fs = require("fs-extra");
const execa = require("execa");
const yaml = require("js-yaml");
class GitDown {
    constructor() {
        this.dir = process.cwd();
        var standard_input = process.stdin;
        standard_input.setEncoding('utf-8');
        console.log("Please, enter your git password:");
        standard_input.on('data', (password) => {
            if (password == 'exit\n') {
                log.info("Input failed.");
                process.exit();
            }
            else {
                this.pass = password.replace(/\n/g, '');
                this.config = yaml.load(fs.readFileSync('gitdown.yaml'));
                log.info(this.config.BRANCH);
                log.info(this.config);
                this.remote = 'https://' + this.config.LOGINName + ':';
                this.remote += this.pass + '@';
                this.remote += this.config.REPO + '/';
                this.remote += this.config.PROJECT;
                this._emptyFolder();
                this.process();
                if (typeof (this.config.LOCALFolder) !== 'undefined')
                    log.info('LOCALFolder is not used, will use REPOfolder, please remove from gitdown.yaml');
            }
        });
    }
    async process() {
        try {
            let b = this.config.BRANCH;
            await this._branchExists(b);
            log.info(this.exists);
            if (this.exists)
                await this._getEXISTINGRemoteBranch(b);
            else
                await this._getNEWRemoteBranch(b);
            this._write(b);
        }
        catch (err) {
            log.error(err);
            process.exit();
        }
    }
    _write(branch) {
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir + '/' + this.config.REPOFolder;
        let dirTo = this.dir + '/' + this.config.REPOFolder;
        log.info(dir, dirTo);
        fs.copySync(dir, dirTo);
        let dirR = this.config.PROJECT;
        dirR = this.dir + '/' + dirR;
        fs.removeSync(dirR);
        log.info('removed temp', dirR);
        fs.writeJsonSync(dirTo + '/branch.json', { branch: branch, syncedOn: new Date().toISOString() });
        log.info('DONE!');
        log.info();
        process.exit();
    }
    _emptyFolder() {
        let dirR = this.config.PROJECT;
        dirR = this.dir + '/' + dirR;
        log.info('clean temp', dirR);
        fs.removeSync(dirR);
    }
    async _getNEWRemoteBranch(branch) {
        const { stdout } = await execa('git', ['clone', this.remote]);
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir;
        await execa('git', ['remote', 'add', branch, this.remote], { cwd: dir });
        await execa('git', ['checkout', '-b', branch], { cwd: dir });
        await execa('git', ['push', '-u', 'origin', branch], { cwd: dir });
    }
    async _getEXISTINGRemoteBranch(branch) {
        const { stdout } = await execa('git', ['clone', this.remote]);
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir;
        await execa('git', ['checkout', branch], { cwd: dir });
        log.info(dir, branch);
    }
    async _branchExists(branch) {
        let cmd = this.remote;
        cmd += '.git';
        log.info(cmd);
        const { stdout } = await execa('git', ['ls-remote', cmd]);
        this.exists = stdout.includes(branch);
        log.info(stdout);
    }
}
exports.GitDown = GitDown;
