
import { SysAgent } from "mbake/lib/SysAgent"

import { HttpRPC } from "mbake/lib/Invoke"


export class Agent {

    static rpc = new HttpRPC('http', 'localhost', 8888)

    async run() {
      
      log.info('loop:')

      await Agent.rpc.invoke('monitor', 'monitor', 'monitor', await SysAgent.stats() )

      await  SysAgent.wait(200)
      this.run()

    }


}