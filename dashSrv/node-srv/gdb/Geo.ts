
const perfy = require('perfy')

const fs = require('fs-extra')

const Reader = require('@maxmind/geoip2-node').Reader

const options = {
   // you can use options like `cache` or `watchForUpdates`
 }

export class Geo {
   //  https://www.npmjs.com/package/@maxmind/geoip2-node



   static asnBuffer = fs.readFileSync('./gdb/GeoLite2-ASN.mmdb')
   static cityBuffer = fs.readFileSync('./gdb/GeoLite2-City.mmdb')
   static asnReader = Reader.openBuffer(Geo.asnBuffer, options)
   static cityReader = Reader.openBuffer(Geo.cityBuffer, options)

   get() {
      const aresp = Geo.asnReader.asn('128.101.101.101')
      console.log(aresp.autonomousSystemOrganization)

      const ctresp = Geo.cityReader.city('128.101.101.101')
      console.log(ctresp.postal.code)
      console.log(ctresp.country.isoCode)

      console.log(ctresp.traits.isAnonymous)
      console.log(ctresp.traits.isAnonymousProxy)
      console.log(ctresp.traits.isAnonymousVpn)
      console.log(ctresp.traits.isHostingProvider)
      console.log(ctresp.traits.isLegitimateProxy)
      console.log(ctresp.traits.isPublicProxy)
      console.log(ctresp.traits.isTorExitNode)

      console.log(ctresp.location.latitude)
      console.log(ctresp.location.longitude)

      console.log(ctresp.subdivisions[0].isoCode)//state

   }


}
