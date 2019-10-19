
import { SysAgent } from "mbake/lib/SysAgent"

import { HttpRPC } from "mbake/lib/Invoke"


export class Client {

    static rpc = new HttpRPC('http', 'localhost', 8888)


    async foo() {
     
        await Client.rpc.invoke('monitor', 'monitor', 'monitor', SysAgent.ping() )

        await  SysAgent.wait(2000)
        this.foo()

    }



}