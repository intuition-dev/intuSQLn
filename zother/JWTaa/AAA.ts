
// Auth & Auth App

import { Serv } from 'http-rpc/lib/Serv'
import { AAHandler } from './handler/AAHandler'

export class AAA extends Serv {

    constructor(origins: Array<string>) {
        super(origins, 4 * 1024 )

        const ha = new AAHandler(null)

        this.routeRPC('aaAPI', ha)

        this.serveStatic('webApp', null, null)

        this.listen(8080)
    }



}