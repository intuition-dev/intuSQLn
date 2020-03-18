
import { TerseB } from "terse-b/terse-b"
import { BaseRPCMethodHandler } from 'http-rpc/lib/Serv'

var jwt = require('jsonwebtoken')

export class AAHandler extends BaseRPCMethodHandler {
    log:any = new TerseB(this.constructor.name) 

    tokenGet(email, pswd){
        // go to redis. If email = 'admin'

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