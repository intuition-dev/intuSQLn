#!/usr/bin/env node
// All rights reserved by INTUITION.DEV |  Cekvenich, licensed under LGPL 3.0

import commandLineArgs = require('command-line-args')

import { SysAgent } from './lib/SysAgent'

import { VersionNag, Dirs} from './lib/FileOpsExtra'

import { GitDown  } from './lib/gitdown'

// imports done /////////////////////////////////////////////
const ver = "v1.0.1"
VersionNag.isCurrent('gagent', ver).then(function (isCurrent_: boolean) {
   try {
      if (!isCurrent_)
         console.log('There is a newer version of mbake CLI, please update.')
   } catch (err) {
      console.log(err)
   }
})// 

const cwd: string = process.cwd()

function version() {
   console.info('mbake CLI version: ' + ver)
}

function help() {
   console.info()
   console.info('mbake CLI version: ' + ver)
   console.info()
   console.info('Usage:')
   console.info('  To download branch from git, in folder with gitdown.yaml:    mbakex --gitDown .')
   console.info('     passing the git password of gitdown user')
   console.info()
   console.info('  List ports in use w/ process ID:                            mbake -p')
 
   console.info(' Full docs: http://www.INTUITION.DEV')

   console.info()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'agent', defaultOption: true },

   { name: 'help', alias: 'h', type: Boolean },
   { name: 'version', alias: 'v', type: Boolean },

   { name: 'gitDown', type: Boolean },

   { name: 'ports', alias: 'p', type: Boolean },

]

const argsParsed = commandLineArgs(optionDefinitions)
let arg: string = argsParsed.mbake
console.info()


// get folder to be processed: ///////////////////////////////////////////////////////////////////////////////////////////////////////
if (arg) {
   arg = Dirs.slash(arg)

   if (arg.startsWith('/')) {
      //do nothing, full path is arg
   } else if (arg.startsWith('..')) { // few  cases to test
      arg = arg.substring(2)
      let d = cwd
      d = Dirs.slash(d)
      // find offset
      let n = d.lastIndexOf('/')
      d = d.substring(0, n)
      arg = d + arg
   } else if (arg.startsWith('.')) {//cur
      arg = cwd
   } else { // just plain, dir passed
      arg = cwd + '/' + arg
   }// inner

}//outer

//  ////////////////////////////////////////////////////////////////////////////////////////////////

function ports() { 
   SysAgent.ports()
}

function git(arg) {
   let gg = new GitDown(arg)
}//()


// start: ///////////////////////////////////////////////////////////////////////////////////// if (argsParsed.pug)
if (argsParsed.version)
   version()
else if (argsParsed.help)
   help()
else if (argsParsed.ports)
   ports()
else if (argsParsed.gitDown)
   git(arg)
else (!arg)
   help()
