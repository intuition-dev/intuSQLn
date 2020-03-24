
import { TerseB } from "terse-b/terse-b"
import { BaseRPCMethodHandler } from 'http-rpc/lib/Serv'

var jwt = require('jsonwebtoken')

export class AAHandler extends BaseRPCMethodHandler {
    log:any = new TerseB(this.constructor.name) 

    constructor() {
        super(1,1)
    }

    tokenGet(email, pswd){
        //  If email = 'admin', else go to redis
        // else return ?
    }

    _tokenIsUser(){}
    _tokenIsAdmin(){}
    tokenLogOut(){}
    
    
    adminAddUser(email, pswd){ // store as hash
    }
    adminChangeUser(oldEmail, newEmail){}
    adminListUsers(){}
    adminDisableUser(email){}
    adminEnableUser(email){}
    
    
    uPswdEmailCode(email){}
    uPswdResetIfMatch(email, code, pswd){}
    
}