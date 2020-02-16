


const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

const log = bunyan.createLogger({src: true, stream: formatOut, name: this.constructor.name })

import fs = require('fs-extra')
import execa = require('execa')
import yaml = require('js-yaml')


export class GitDown {

    config
    remote
    pass: string
    git: any
    dir: string
    constructor(pass_) {
       var standard_input = process.stdin;
 
       // Set input character encoding.
       standard_input.setEncoding('utf-8')
 
       // Prompt user to input data in console.
       console.log("Please, enter your git password:")
 
       // When user input data and click enter key.
       standard_input.on('data', (password:string) => {
 
          // User input exit.
          if (password == 'exit\n') {
             log.info("Input failed.")
             process.exit()
          } else {
 
             const last = pass_.lastIndexOf('/')
             this.pass = password.replace(/\n/g, '');
             this.dir = pass_.substring(0, last);
 
             this.config = yaml.load(fs.readFileSync('gitdown.yaml'))
             log.info(this.dir, this.config.BRANCH)
             log.info(this.config)
 
             this.remote = 'https://' + this.config.LOGINName + ':'
             this.remote += this.pass + '@'
             this.remote += this.config.REPO + '/'
             this.remote += this.config.PROJECT
 
             this._emptyFolder();
             this.process();
 
             if (typeof(this.config.LOCALFolder) !== 'undefined')
                log.info('LOCALFolder is not used, will use REPOfolder, please remove from gitdown.yaml')
 
          }
       })
    }//()
 
    async process() {
       try {
          let b = this.config.BRANCH
          await this._branchExists(b)
          log.info(this.exists)
 
          if (this.exists) await this._getEXISTINGRemoteBranch(b)
          else await this._getNEWRemoteBranch(b)
 
          this._write(b)
       } catch (err) {
          log.error(err);
          process.exit();
       }
    }
 
    _write(branch) { // move to folder
 
       let dir = this.config.PROJECT
       dir = this.dir + '/' + dir + '/' + this.config.REPOFolder
 
       let dirTo = this.dir + '/' + this.config.REPOFolder
       log.info(dir, dirTo)
 
       fs.copySync(dir, dirTo)
 
       let dirR = this.config.PROJECT
       dirR = this.dir + '/' + dirR
       fs.removeSync(dirR)
       log.info('removed temp', dirR)
 
       fs.writeJsonSync(dirTo + '/branch.json', { branch: branch, syncedOn: new Date().toISOString() })
       log.info('DONE!')
 
       log.info()
       process.exit()
    }
 
    
    _emptyFolder() {
       let dirR = this.config.PROJECT
       dirR = this.dir + '/' + dirR
       log.info('clean temp', dirR)
       fs.removeSync(dirR)
    }
 
    async _getNEWRemoteBranch(branch) {
       const { stdout } = await execa('git', ['clone', this.remote])
 
       let dir = this.config.PROJECT
       dir = this.dir + '/' + dir
       //make a branch
       await execa('git', ['remote', 'add', branch, this.remote], { cwd: dir })
       await execa('git', ['checkout', '-b', branch], { cwd: dir })
       // add to remote
       await execa('git', ['push', '-u', 'origin', branch], { cwd: dir })
 
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
 
    async _getEXISTINGRemoteBranch(branch) { // if null, master
       const { stdout } = await execa('git', ['clone', this.remote])
 
       let dir = this.config.PROJECT
       dir = this.dir + '/' + dir
       await execa('git', ['checkout', branch], { cwd: dir })
       log.info(dir, branch)
 
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
 
    exists: boolean
    async _branchExists(branch) {
       let cmd = this.remote
       cmd += '.git'
       log.info(cmd)
 
       const { stdout } = await execa('git', ['ls-remote', cmd])
       this.exists = stdout.includes(branch)
 
       log.info(stdout)
       /*
       git ls-remote https:// Cekvenich:PASS@github.com/ Cekvenich/alan.git
       */
    }//()
 }//class
 
 