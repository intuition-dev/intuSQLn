"use strict";
// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitDown = void 0;
const terse_b_1 = require("terse-b/terse-b");
const fs = require("fs-extra");
const execa = require("execa");
const yaml = require("js-yaml");
class GitDown {
    constructor() {
        this._log = new terse_b_1.TerseB(this.constructor.name);
        this.dir = process.cwd();
        var standard_input = process.stdin;
        // Set input character encoding.
        standard_input.setEncoding('utf-8');
        // Prompt user to input data in console.
        console.log("Please, enter your git password:");
        // When user input data and click enter key.
        standard_input.on('data', (password) => {
            // User input exit.
            if (password == 'exit\n') {
                this._log.warn("Input failed.");
                process.exit();
            }
            else {
                this.pass = password.replace(/\n/g, '');
                this.config = yaml.load(fs.readFileSync('gitdown.yaml'));
                console.info(this.config.BRANCH);
                console.info(this.config);
                this.remote = 'https://' + this.config.LOGINName + ':';
                this.remote += this.pass + '@';
                this.remote += this.config.REPO + '/';
                this.remote += this.config.PROJECT;
                this._emptyFolder();
                this.process();
                if (typeof (this.config.LOCALFolder) !== 'undefined')
                    this._log.warn('LOCALFolder is not used, will use REPOfolder, please remove from gitdown.yaml');
            }
        });
    } //()
    async process() {
        try {
            let b = this.config.BRANCH;
            await this._branchExists(b);
            this._log.info(this.exists);
            if (this.exists)
                await this._getEXISTINGRemoteBranch(b);
            else
                await this._getNEWRemoteBranch(b);
            this._write(b);
        }
        catch (err) {
            this._log.error(err);
            process.exit();
        }
    }
    _write(branch) {
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir + '/' + this.config.REPOFolder;
        let dirTo = this.dir + '/' + this.config.REPOFolder;
        this._log.info(dir, dirTo);
        fs.copySync(dir, dirTo);
        let dirR = this.config.PROJECT;
        dirR = this.dir + '/' + dirR;
        fs.removeSync(dirR);
        this._log.info('removed temp', dirR);
        fs.writeJsonSync(dirTo + '/branch.json', { branch: branch, syncedOn: new Date().toISOString() });
        console.info('DONE!');
        this._log.info();
        process.exit();
    }
    _emptyFolder() {
        let dirR = this.config.PROJECT;
        dirR = this.dir + '/' + dirR;
        this._log.info('clean temp', dirR);
        fs.removeSync(dirR);
    }
    async _getNEWRemoteBranch(branch) {
        const { stdout } = await execa('git', ['clone', this.remote]);
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir;
        //make a branch
        await execa('git', ['remote', 'add', branch, this.remote], { cwd: dir });
        await execa('git', ['checkout', '-b', branch], { cwd: dir });
        // add to remote
        await execa('git', ['push', '-u', 'origin', branch], { cwd: dir });
        /* list history of the new branch TODO
        await execa('git', ['fetch'], {cwd: dir})
        const {stdout10} = await execa('git', ['log', '-8', '--oneline', 'origin/'+branch], {cwd: dir})
        log.info('history', stdout10)
        /*
        git clone https:// Cekvenich:PASS@github.com/ Cekvenich/alan
        cd folder
        git remote add test2 https:// Cekvenich:PASS@github.com/ Cekvenich/alan
        git checkout -b test2
        git push -u origin test2
        */
    }
    async _getEXISTINGRemoteBranch(branch) {
        const { stdout } = await execa('git', ['clone', this.remote]);
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir;
        await execa('git', ['checkout', branch], { cwd: dir });
        this._log.info(dir, branch);
        /* list history of the branch TODO
        await execa('git', ['fetch'], {cwd: dir})
        const {stdout10} = await execa('git', ['log', '-8', '--oneline', 'origin/'+branch], {cwd: dir})
        log.info('history', stdout10)
        /*
        git clone https:// Cekvenich:PASS@github.com/ Cekvenich/alan
        cd folder
        git checkout test2
        */
    }
    async _branchExists(branch) {
        let cmd = this.remote;
        cmd += '.git';
        this._log.info(cmd);
        const { stdout } = await execa('git', ['ls-remote', cmd]);
        this.exists = stdout.includes(branch);
        this._log.info(stdout);
        /*
        git ls-remote https:// Cekvenich:PASS@github.com/ Cekvenich/alan.git
        */
    } //()
} //class
exports.GitDown = GitDown;
