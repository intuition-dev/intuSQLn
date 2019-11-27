
const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "GDB"})

const perfy = require('perfy')

const fs = require('fs-extra')

const Reader = require('@maxmind/geoip2-node').Reader

const options = {
   // you can use options like `cache` or `watchForUpdates`
 }

// https://simplemaps.com/data/us-zips

export class Geo {
   //  https://www.npmjs.com/package/@maxmind/geoip2-node

   static asnBuffer = fs.readFileSync('./gdb/GeoLite2-ASN.mmdb')
   static cityBuffer = fs.readFileSync('./gdb/GeoLite2-City.mmdb')
   static asnReader = Reader.openBuffer(Geo.asnBuffer, options)
   static cityReader = Reader.openBuffer(Geo.cityBuffer, options)

   get(ip:string) {

      const aresp = Geo.asnReader.asn(ip)
      const ctresp = Geo.cityReader.city(ip)
      
      let geo = {}
      geo['aso'] = aresp.autonomousSystemOrganization
      geo['post'] = ctresp.postal.code
      geo['cou'] =ctresp.country.isoCode

      const proxy:boolean = 
         ctresp.traits.isAnonymous ||
         ctresp.traits.isAnonymousProxy ||
         ctresp.traits.isAnonymousVpn ||
         ctresp.traits.isHostingProvider || 
         ctresp.traits.isLegitimateProxy || 
         ctresp.traits.isPublicProxy ||
         ctresp.traits.isTorExitNode
      if(proxy)
         geo['proxy']= 1
      else geo['proxy']= 0

      geo['lat']= ctresp.location.latitude
      geo['long']= ctresp.location.longitude

      geo['sub']= ctresp.subdivisions[0].isoCode

      log.info(geo)
      return geo
   }//()


}
