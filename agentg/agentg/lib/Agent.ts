
import { SysAgent } from "./SysAgent"

import { HttpRPC } from "http-rpc/lib/Invoke"

const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

export class Agent {

    _log = bunyan.createLogger({src: true, stream: formatOut, name: this.constructor.name })

    static rpc = new HttpRPC('http', 'localhost', 8888)

    async run() {
      this._log.info('loop:')

      let params = await SysAgent.stats()
      let ports = await SysAgent.ports()
      params['ports'] = ports
      let ps = await SysAgent.ps()
      params['ps']= ps

      await Agent.rpc.invoke('agent',  'agent', 'agent', params  )

      await  SysAgent.wait(1400)
      //this.run()

    }


}