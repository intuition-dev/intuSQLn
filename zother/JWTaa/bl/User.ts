
import { BaseSDB } from './BaseSDB'

import { Email } from './Email'
const email = new Email()
import { JWT } from './jwtUtil'
const jwt = new JWT()

import { DateTime } from 'luxon'

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
    await this.writeOne(('/salt/salt'), {salt: jwt.genSalt()})
}

async _setSalt() {
    let dat = await this.readOne('/salt/salt')
    this.salt = dat['salt']
}

async adminWriteUser(email, pswd) {
    if(!this.salt) throw new Error('no salt')
    const hpswd = jwt.hashPass(pswd, this.salt)
    await this.writeOne(this.prefix+email, {pswd:hpswd, email:email})
}

// /////////////////////////////////
tokenCheckNRenew(token, ip, finger) {

}


tokenLoginGet(email, pswd){
    //  If email = 'admin', else go to redis
    // else return ?
}


async _checkUser(email, pswd) {
    if(!this.salt) throw new Error('no salt')
    const hpswd = jwt.hashPass(pswd, this.salt)
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

async pswdEmailCode(email){

    let vcode = Math.floor(1000 + Math.random() * 9000);

    var to_name = email
        ,to_email = email
        ,from_name = 'Intu'
        ,from_email = 'support@intu.com'
        ,subject = 'validate your email'
        ,body = 'Please type in this code to validate your access: ' + vcode


    email.send(
        'gmail',  'tone', 'user_4aWUwDyNvJDTKwiCEtCgz',
        to_name
        ,to_email
        ,from_name
        ,from_email
        ,subject
        ,body
    )

    let obj =  await this.readOne(this.prefix+email)
    obj['vcode'] = vcode
    obj['vcode_ts'] = new Date()
    this.writeOne(this.prefix+email, obj)

}//()

async pswdResetIfMatch(email, guessCode, newPswd) {
    let obj =  await this.readOne(this.prefix+email)
    const vcode = obj['vcode']
    if(vcode!=guessCode) return false

    // set new password
    const hpswd = jwt.hashPass(newPswd, this.salt)
    this.writeOne(this.prefix+email, obj)
}


}//class