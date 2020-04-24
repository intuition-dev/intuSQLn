
//import { Geo } from "./gdb/Geo"
import { MeDB } from "./db/MeDB"
//import { GDB } from "./gdb/GDB"

//import { S3 } from "./db/S3"

//console.log( new Geo().get('64.78.253.68') )

//let g = new GDB()

//g.load()

//new GDB().get('64.78.253.68')

const db = new MeDB()

import { DashHandler } from "./handler/DashHandler"

const m = new MeDB()

// console.log(m.dashPageViews('www.ubaycap.com'))

console.log(2)
//console.log( m.dashPgPopular('www.ubaycap.com'))

console.log(3)
//console.log(m.dashRef('www.ubaycap.com'))

console.log(4)
//console.log(m.dashGeo('www.ubaycap.com'))

console.log(5)
console.log(m.dashRecentUsers('www.ubaycap.com'))


