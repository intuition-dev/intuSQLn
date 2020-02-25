"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDBL_1 = require("mbakex/lib/BaseDBL");
const Geo_1 = require("../gdb/Geo");
const Utils_1 = require("./Utils");
const luxon_1 = require("luxon");
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
class MeDB extends BaseDBL_1.BaseDBL {
    constructor() {
        super();
        this.log = bunyan.createLogger({ src: true, stream: formatOut, name: this.constructor.name });
        MeDB._geo = new Geo_1.Geo();
        this.schema();
    }
    _getPriorDateTimeDiff(fullFinger, curDate) {
        const rows = this.read(`SELECT dateTime FROM met
         WHERE fullFinger = ?
         ORDER BY rowid DESC 
         LIMIT 1
         `, fullFinger);
        if ((!rows) || rows.length != 1)
            return MeDB.MAXINT;
        this.log.info(rows);
        const row = rows[0];
        const delta = (Date.parse(curDate) - Date.parse(row['dateTime']));
        this.log.info(delta);
        return delta;
    }
    async writeMetrics(domain, fullFinger, params, ip) {
        const date = luxon_1.DateTime.local().toString();
        let referrerLocalFlag = 0;
        const refHost = Utils_1.Utils.getHostname(params.referrer);
        const curHost = Utils_1.Utils.getHostname(params.domain);
        if (curHost == refHost)
            referrerLocalFlag = 1;
        let priorDateTimeDiff = this._getPriorDateTimeDiff(fullFinger, date);
        this.log.info(priorDateTimeDiff);
        this.write(`INSERT INTO met( fullFinger, dateTime, 
         url, title, referrer, domTime,
         referrerLocalFlag, priorDateTimeDiff )
            VALUES
         ( ?,?,
          ?,?,?,?,
          ?,?
         )`, fullFinger, date, params.domain, params.title, params.referrer, params.domTime, referrerLocalFlag, priorDateTimeDiff);
        this.log.info('met');
        this.writeDevice(fullFinger, ip, params, domain, date);
    }
    async writeDevice(fullFinger, ip, params, domain, date) {
        if (MeDB._fingeExists(fullFinger, this))
            return;
        const geo = await MeDB._geo.getG(ip);
        let langCou = null;
        try {
            if (params.lang.includes('-')) {
                let pos = params.lang.indexOf('-');
                langCou = params.lang.substring(pos);
            }
        }
        catch (err) {
            this.log.err(err);
        }
        this.write(`INSERT INTO device( domain, fullFinger, ip,
         lat, long, geoTz,  cou, cou2, sub,  state, city, 
         city2, post, aso,  proxy,
         bro, os, mobile, tz, lang, langCou, ie, 
         hw, dateTime)
            VALUES
      ( ?, ?, ?,
       ?,?,?, ?,?,?, ?,?,
       ?,?,?, ?,
       ?,?,?, ?,?,?,?,
       ?,?
      )`, domain, fullFinger, ip, geo.lat, geo.long, geo.geoTz, geo.cou, geo.cou2, geo.sub, geo.state, geo.city, geo.city2, geo.post, geo.aso, geo.proxy, params.bro, params.os, params.mobile, params.tz, params.lang, langCou, params.ie, params.h + 'x' + params.w, date);
        this.log.info('dev');
    }
    writeError(domain, fullFinger, ip, url, message, extra, mode, name, stack) {
        const date = luxon_1.DateTime.local().toString();
        if (!message)
            message = null;
        if (!mode)
            mode = null;
        if (!name)
            name = null;
        if (!stack)
            stack = null;
        if (typeof stack !== 'string')
            stack = JSON.stringify(stack);
        this.write(`INSERT INTO error( domain, dateTime, fullFinger, ip, url,
         message, mode, name, stack)
         VALUES
      (  ?, ?, ?, ?, ?,
         ?,?,?,?
      )`, domain, date, fullFinger, ip, url, message, mode, name, stack);
        this.log.info('err');
        this.writeDevice(fullFinger, ip, extra, domain, date);
    }
    static _fingeExists(fullFinger, ctx) {
        const rows = ctx.read(`SELECT fullFinger FROM device
         WHERE fullFinger = ?
         LIMIT 1
         `, fullFinger);
        if ((!rows) || rows.length != 1)
            return false;
        return true;
    }
    schema() {
        this.defCon(process.cwd(), '/met.db');
        const exists = this.tableExists('met');
        this.log.info('schema', exists);
        if (exists)
            return;
        this.write(` CREATE TABLE error( domain, dateTime TEXT, fullFinger, ip TEXT, url, message TEXT, mode TEXT, name TEXT, stack TEXT
      ) `);
        this.write(`CREATE INDEX i_error ON error(domain, fullFinger, dateTime DESC)`);
        this.write(`CREATE TABLE met(  fullFinger TEXT, dateTime TEXT, 
            url, title, referrer, domTime, 
            referrerLocalFlag INTEGER, priorDateTimeDiff INT
         ) `);
        this.write(`CREATE INDEX i_met ON met (dateTime DESC)`);
        this.write(`CREATE TABLE device( domain, fullFinger TEXT NOT NULL PRIMARY KEY, ip TEXT,
            lat, long, geoTz, cou, cou2, sub, state, city, city2, post, aso, proxy INTEGER,
            bro, os, mobile INTEGER, tz, lang, langCou, ie INTEGER, 
            hw, dateTime TEXT
         ) WITHOUT ROWID `);
        this.write(`CREATE INDEX i_device ON device(domain, fullFinger, dateTime DESC)`);
        this.log.info('schemaDone');
    }
    dashPageViews(domain) {
        const dau = `SELECT date(dateTime) AS date, count(*) AS COUNT 
      FROM met 
      WHERE domain = ? AND dateTime >= ? 
      GROUP BY date 
      ORDER by date DESC 
      `;
        let weeksAgo = luxon_1.DateTime.local().minus({ days: 45 + 1 });
        this.log.info(weeksAgo.toString());
        const rows = this.read(dau, domain, weeksAgo.toString());
        return rows;
        let newOrReturning = `SELECT met.fullFinger, date(device.dateTime) AS first, date(met.dateTime) AS visited, count(*) AS COUNT
      FROM met
      INNER JOIN device ON met.fullFinger = device.fullFinger
      GROUP BY met.fullFinger, first, visited
      ORDER by first, visited DESC 
      `;
    }
    dashPgPopular(domain) {
        let weeksAgo = luxon_1.DateTime.local().minus({ days: 30 + 1 });
        let s = ` SELECT url, count(*) AS COUNT 
      FROM met
      WHERE domain = ? AND dateTime >= ? 
      GROUP BY url
      ORDER BY COUNT DESC
      LIMIT 15
      `;
        const rows = this.read(s, domain, weeksAgo.toString());
        return rows;
    }
    dashRef(domain) {
        let s = ` SELECT referrer, count(*) AS COUNT 
      FROM met
      WHERE domain = ? AND referrerLocalFlag = 0 
      GROUP BY referrer
      ORDER BY COUNT DESC
      LIMIT 15
      `;
        const rows = this.read(s, domain);
        return rows;
    }
    dashGeo(domain) {
        let weeksAgo = luxon_1.DateTime.local().minus({ days: 30 + 1 });
        let state = ` SELECT  lang, cou, sub, count(*) AS COUNT
      FROM device
      INNER JOIN met ON met.fullFinger = device.fullFinger
      WHERE device.domain = ? AND met.dateTime >= ? 
      GROUP BY lang, cou, sub
      ORDER BY COUNT DESC
      LIMIT 20
      `;
        const rows = this.read(state, domain, weeksAgo.toString());
        return rows;
        let aso = `SELECT tz, lang, cou, sub, aso, count(*) AS COUNT
      FROM device
      GROUP BY tz, lang, cou, sub, aso
      `;
    }
    dashRecentUsers(domain) {
        const rows = this.read(`
      SELECT m.dateTime, d.ip, m.title, d.cou, d.sub, d.aso, d.mobile
      FROM met m, device d
      WHERE m.fullFinger = d.fullFinger
      AND m.datetime = ( SELECT MAX(dateTime) FROM met m2 WHERE m2.fullFinger = m.fullFinger )
      AND d.domain = ? 
      ORDER BY m.dateTime DESC 
      LIMIT 60
       `, domain);
        return rows;
    }
}
exports.MeDB = MeDB;
MeDB.MAXINT = 9223372036854775807;
