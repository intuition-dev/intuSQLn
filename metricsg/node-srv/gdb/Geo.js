"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const GDB_1 = require("./GDB");
const perfy = require('perfy');
const fs = require('fs-extra');
const Reader = require('@maxmind/geoip2-node').Reader;
const options = {
// you can use options like `cache` or `watchForUpdates`
};
// https://simplemaps.com/data/us-zips
class Geo {
    constructor() {
        //  https://www.npmjs.com/package/@maxmind/geoip2-node
        this.log = new terse_b_1.TerseB(this.constructor.name);
        this.gdb = new GDB_1.GDB();
    }
    async getG(ip) {
        const aresp = await Geo.asnReader.asn(ip);
        const ctresp = await Geo.cityReader.city(ip);
        //const cnresp = Geo.cntryReader.country(ip)
        //console.log(ctresp.subdivisions[0].names)
        let geo = await this.gdb.get(ip);
        if (!geo)
            geo = {};
        geo['aso'] = aresp.autonomousSystemOrganization;
        if (!ctresp)
            return geo;
        try {
            geo['cou2'] = ctresp.country.isoCode;
            geo['sub'] = ctresp.subdivisions[0].isoCode;
            geo['city2'] = ctresp.city.names.en;
            geo['post'] = ctresp.postal.code;
            geo['lat'] = ctresp.location.latitude;
            geo['long'] = ctresp.location.longitude;
            geo['geoTz'] = ctresp.location.timeZone;
            const proxy = ctresp.traits.isAnonymous ||
                ctresp.traits.isAnonymousProxy ||
                ctresp.traits.isAnonymousVpn ||
                ctresp.traits.isHostingProvider ||
                ctresp.traits.isLegitimateProxy ||
                ctresp.traits.isPublicProxy ||
                ctresp.traits.isTorExitNode;
            if (proxy)
                geo['proxy'] = 1;
            else
                geo['proxy'] = 0;
        }
        catch (err) {
            this.log.info(err);
        }
        return geo;
    } //()
}
exports.Geo = Geo;
Geo.asnBuffer = fs.readFileSync('./gdb/GeoLite2-ASN.mmdb');
Geo.cityBuffer = fs.readFileSync('./gdb/GeoLite2-City.mmdb');
Geo.asnReader = Reader.openBuffer(Geo.asnBuffer, options);
Geo.cityReader = Reader.openBuffer(Geo.cityBuffer, options);
