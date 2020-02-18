// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

const checkDiskSpace = require('check-disk-space')
const psList = require('ps-list')
const find = require('find-process')

export class SysAgent { 
    _log = bunyan.createLogger({src: true, stream: formatOut, name: this.constructor.name })

    static guid = require('uuid/v4')

    static si = require('systeminformation')

    static os = require('os')

    /*
    list of running processes  
    */
    static  ps() {
        return psList()
    }

    static disk() {
        return new Promise(function(resolve, reject) {
            checkDiskSpace('/').then((diskSpace) => {
                resolve(diskSpace)
            })
        })
    }//()

    async ports() { 
      const THIZ = this
      let ports = []
      await SysAgent.si.networkConnections().then(data => { 
         data.forEach(function(v){
            ports.push(v.localport)
         }) 
      })
      //console.log(ports)
      let results = []
      let pids = {}
      for (let i = 0; i < ports.length; i++) {
            try {
                let row = await find('port', ports[i])
                //console.log(ports[i], row)
                if(!row) continue
                if(row[0]) row = row[0]

                let pid = row['pid'] 
                if(!pid) continue
                // do we have that port already?
                if(pids.hasOwnProperty(pid)) continue
                pids[pid]= 'X' //just track the pid
                
                let ins = {port: ports[i], pid:pid, name:row['name']}
                results.push(ins)
            } catch(err) { THIZ._log.info(err)}
      }//for

      //console.log(results)
      return results
   }//()

    static async statsBig() { // often like 1 second
        const track =  new Object() 
        track['guid']= SysAgent.guid()
        track['dt_stamp']= new Date().toISOString()
        track['host']=SysAgent.os.hostname() 

        let disk = await SysAgent.disk()
        track['disk'] = disk
        
        return track
    }//()


    static async statsSmall() { // often like 1 second
        const track =  new Object() 
        track['guid']= SysAgent.guid()
        track['host']=SysAgent.os.hostname() 
        track['dt_stamp']= new Date().toISOString()

        await SysAgent.si.disksIO().then(data => {
            track['ioR']=data.rIO
            track['ioW']=data.wIO
        })
        
        await SysAgent.si.fsStats().then(data => { 
            track['fsR']=data.rx
            track['fsW']=data.wx
        })

        await SysAgent.si.fsOpenFiles().then(data => {
            track['openMax']=data.max
            track['openAlloc']=data.allocated
        })

        let nic 
        await  SysAgent.si.networkInterfaceDefault().then(data => {
            nic = data
        })
        await SysAgent.si.networkStats(nic).then( function(data){ 
            const dat = data[0]
            track['nicR']=dat.rx_bytes
            track['nicT']=dat.tx_bytes
        })

        await SysAgent.si.mem().then(data => {
            track['memFree']=data.free
            track['memUsed']=data.used
            track['swapUsed']=data.swapused
            track['swapFree']=data.swapfree
        })

        await SysAgent.si.currentLoad().then(data => {
            track['cpu']= data.currentload
            track['cpuIdle']= data.currentload_idle
        })
        
        return track
    }//()

    static wait(t):Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(function(){
                resolve()
            },t)
        })
    }//()

}//class

