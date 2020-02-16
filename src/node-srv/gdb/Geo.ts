
const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })

import { GDB } from "./GDB"

const perfy = require('perfy')

const fs = require('fs-extra')

const Reader = require('@maxmind/geoip2-node').Reader

const options = {
   // you can use options like `cache` or `watchForUpdates`
 }

// https://simplemaps.com/data/us-zips

export class Geo {
   //  https://www.npmjs.com/package/@maxmind/geoip2-node


   log = bunyan.createLogger({src: true, stream: formatOut, name: this.constructor.name })

   static asnBuffer = fs.readFileSync('./gdb/GeoLite2-ASN.mmdb')
   static cityBuffer = fs.readFileSync('./gdb/GeoLite2-City.mmdb')
   
   static asnReader = Reader.openBuffer(Geo.asnBuffer, options)
   static cityReader = Reader.openBuffer(Geo.cityBuffer, options)

   gdb:GDB  = new GDB()

   async getG(ip:string) {

      const aresp = await Geo.asnReader.asn(ip)
      const ctresp = await Geo.cityReader.city(ip)
      //const cnresp = Geo.cntryReader.country(ip)

      //console.log(ctresp.subdivisions[0].names)

      let geo = await this.gdb.get(ip)
      if(!geo) geo = {}
      geo['aso']  = aresp.autonomousSystemOrganization

      if(!ctresp) return geo
      try {
         geo['cou2']  = ctresp.country.isoCode
         geo['sub']=   ctresp.subdivisions[0].isoCode
         geo['city2']=  ctresp.city.names.en

         geo['post'] = ctresp.postal.code
      
         geo['lat']= ctresp.location.latitude
         geo['long']= ctresp.location.longitude
         geo['geoTz'] = ctresp.location.timeZone

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
      } catch (err) {
         this.log.info(err)
      }
      return geo
   }//()


}
