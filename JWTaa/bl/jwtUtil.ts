
const bcrypt = require('bcryptjs') // to hash passwords

const jwt = require('jsonwebtoken')
// https://github.com/auth0/node-jsonwebtoken

export class JWT {



hashPass(password, salt) {
    return bcrypt.hashSync(password, salt) 
}
genSalt() {
    return bcrypt.genSaltSync(10)
}

}