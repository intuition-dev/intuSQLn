
import { TerseB } from "terse-b/terse-b"
import { BaseRPCMethodHandler } from 'http-rpc/lib/Serv'
import { User } from "../bl/User"


export class AAHandler extends BaseRPCMethodHandler {
    log:any = new TerseB(this.constructor.name) 

    sdb:User

    constructor(sdb) {
        super(1,1)
        this.sdb = sdb
    }
    

    tokenCheckNRenew(token, ip, finger) {

    }


    tokenLoginGet(email, pswd){
        //  If email = 'admin', else go to redis
        // else return ?
    }

    tokenLogOut(){}
    
    
    adminAddUser(email, pswd){ // store as hash
    }
    adminChangeUserEmail(oldEmail, newEmail){}
    adminListUsers(){}

    
    pswdEmailCode(email){}
    pswdResetIfMatch(email, code, pswd){}
    
}