
import { BaseSDB } from './BaseSDB'

export class User extends BaseSDB {

    prefix = '/users/'
    salt = '123'

    constructor() {
        super({}, '')
        this.salt = '123'
    }

    async initSalt() {
        await this.writeOne(this.prefix+'salt', {salt: this.genSalt()})
    }

    getSalt() {
        let dat = this.readOne(this.prefix+'salt')
        this.salt = dat['salt']
    }

    async _addUser(email, pswd) {
        const hpswd = this.hashPass(pswd, this.salt)
        await this.writeOne(this.prefix+email, {pswd:hpswd})
    }
    
}