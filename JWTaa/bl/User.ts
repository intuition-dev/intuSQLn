
import { BaseSDB } from './BaseSDB'

const fetch = require('make-fetch-happen')

export class User extends BaseSDB {

prefix = '/users/'
salt 

jwtSharedSecret = '123'

constructor() {
    super({}, '')
    this.salt = '123'
    this._setSalt()
}

async _initSalt() {
    await this.writeOne(('/salt/salt'), {salt: this.genSalt()})
}

async _setSalt() {
    let dat = await this.readOne('/salt/salt')
    this.salt = dat['salt']
}

async adminWriteUser(email, pswd) {
    if(!this.salt) throw new Error('no salt')
    const hpswd = this.hashPass(pswd, this.salt)
    await this.writeOne(this.prefix+email, {pswd:hpswd, email:email})
}


async checkUser(email, pswd) {
    if(!this.salt) throw new Error('no salt')
    const hpswd = this.hashPass(pswd, this.salt)
    let dat = await this.readOne(this.prefix+email)
    const hpswd2 = dat['pswd']
    return hpswd == hpswd2
}


async listUsers() {
    let users=[]
    let usersO:any = await this.list(this.prefix)
    for (let obj in usersO) {
        users.push(obj['email'])
      }
    return users
}

pswdEmailCode(email){

}

pswdResetIfMatch(email, guessCode, pswd) {

}


// CRM
// rpc
// jwt
// high bug on decoder for download
    
}//class