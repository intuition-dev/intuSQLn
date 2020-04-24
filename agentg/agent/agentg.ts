#!/usr/bin/env node
// All rights reserved by INTUITION.DEV |  Cekvenich, licensed under LGPL 3.0

import commandLineArgs = require('command-line-args')

import { SysAgent } from './lib/SysAgent'

import { VersionNag, Dirs} from './lib/FileOpsExtra'

import { GitDown  } from './lib/gitdown'
import { Agent } from './lib/Agent'

// imports done /////////////////////////////////////////////
const ver = "v2.4.22"
VersionNag.isCurrent('agentg', ver).then(function (isCurrent_: boolean) {
   try {
      if (!isCurrent_)
         console.log('There is a newer version of agentg CLI, please update.')
      else console.log('Current')
   } catch (err) {
      console.log(err)
   }
})// 

const cwd: string = process.cwd()

function version() {
   console.info('agentg CLI version: ' + ver)
}

function help() {
   console.info()
   console.info('agentg CLI version: ' + ver)
   console.info()
   console.info('Usage:')
   console.info('  To start agent monitoring:                                agentg -s')
   console.info('  List ports in use w/ process ID:                          agentg -p')
   console.info('  Show available/free disk space:                           agentg -d')
   console.info('  Show available/free memory:                               agentg -m')

   console.info()

   console.info('  To download branch from git, in folder with gitdown.yaml: agentg -g')
   console.info()

   console.info(' Full docs: http://www.INTUITION.DEV')

   console.info()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'agentg', defaultOption: true },
   { name: 'start', alias: 's', type: Boolean },

   { name: 'help', alias: 'h', type: Boolean },
   { name: 'version', alias: 'v', type: Boolean },

   { name: 'gitDown', alias: 'g', type: Boolean },

   { name: 'ports', alias: 'p', type: Boolean },
   { name: 'disk',  alias: 'd', type: Boolean },
   { name: 'mem',   alias: 'm', type: Boolean },

]

const argsParsed = commandLineArgs(optionDefinitions)
let arg: string = argsParsed.agentg
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

async function mem() { 
   let disk = await SysAgent.mem() 
   console.log(disk)
}

async function disk() { 
   let disk = await SysAgent.disk() 
   console.log(disk)
}

function start() {
   new Agent().runSmall()
}

async function ports() { 
   let ports = await new SysAgent().ports() 
   console.log(ports)
}

function git() {
   new GitDown()
}//()


// start: ///////////////////////////////////////////////////////////////////////////////////// if (argsParsed.pug)
if (argsParsed.ports)
   ports()
else if (argsParsed.disk)
   disk()
else if (argsParsed.mem)
   mem()
else if (argsParsed.gitDown)
   git()
else if (argsParsed.start)
   start()
else if (argsParsed.version)
   version()
else
   help()
