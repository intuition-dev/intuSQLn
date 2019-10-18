
import { SysAgent } from "mbake/lib/SysAgent"

import { httpRPC } from "mbake/lib/Invoke"


export class Client {

    static rpc = new httpRPC('http', 'localhost', 8888)


    async foo() {
     
        await Client.rpc.invoke('monitor', 'monitor', 'monitor', new SysAgent().ping() )


        await new SysAgent().wait(2000)
        this.foo()

    }



}