
import { BaseSDB } from './bl/BaseSDB'


const db = new BaseSDB({
    endPoint:  'ewr1.vultrobjects.com',
    accessKey: '0X4E06GBGUV1H1C5T0VE',
    secretKey: 'AdIr5P13vmvXl0IHsh7i1xCWhMafth8XPhxRV8Ju'
}, 'aausers')

tst()

async function tst() {
    //await this.writeOne('/one/me2', {d:'c2'})

    //const dat = await this.readOne('/one/me2')
    //console.log(dat)

    const l = await db.list('/one')
    console.log(l)
}