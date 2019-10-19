
import { SysAgent } from "mbake/lib/SysAgent"

import { HttpRPC } from "mbake/lib/Invoke"

var logger = require('tracer').console()


export class Client {

    static rpc = new HttpRPC('http', 'localhost', 8888)


    async foo() {
      
      logger.trace('loop')

      await Client.rpc.invoke('monitor', 'monitor', 'monitor', SysAgent.ping() )

      await  SysAgent.wait(2000)
      this.foo()

    }



}