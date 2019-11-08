
const perfy = require('perfy')

const fs = require('fs-extra')

const Reader = require('@maxmind/geoip2-node').Reader

export class Geo {
   //  https://www.npmjs.com/package/@maxmind/geoip2-node

   static options = {
      // you can use options like `cache` or `watchForUpdates`
    }

   static asnBuffer = fs.readFileSync('./gdb/GeoLite2-ASN.mmdb')
   static cityBuffer = fs.readFileSync('./gdb/GeoLite2-City.mmdb')
   static couBuffer = fs.readFileSync('./gdb/GeoLite2-Country.mmdb')
   static asnReader = Reader.openBuffer(Geo.asnBuffer)
   static cityReader = Reader.openBuffer(Geo.cityBuffer)
   static couReader = Reader.openBuffer(Geo.couBuffer)

   get() {
      const aresp = Geo.asnReader.asn('128.101.101.101')
      console.log(aresp['autonomousSystemOrganization'])

      const ctresp = Geo.cityReader.city('128.101.101.101')
      console.log(ctresp)

      console.log('xxx')
      const couresp = Geo.couReader.country('128.101.101.101')
      console.log(couresp)


   }


}
