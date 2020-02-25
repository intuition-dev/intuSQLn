"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "pup" });
class Pupp {
    async grade(url) {
        const browser = await puppeteer_1.default.launch({
            devtools: true,
            headless: true
        });
        const [page] = await browser.pages();
        const client = await page.target().createCDPSession();
        await client.send('Network.enable');
        await client.send('Network.clearBrowserCache');
        const domains = {};
        page.on('response', response => {
            const url = response.url();
        });
        page.on('console', msg => {
            let fs = '';
            for (let i = 0; i < msg.args().length; ++i) {
                let s = ' ' + msg.args()[i];
                s = s.split(':')[1];
                if (!s)
                    continue;
                fs += s + ' ';
            }
            fs = fs.trim();
            if (fs.length > 0)
                console.log(fs);
            if (fs == 'TestsDone')
                browser.close();
        });
        page.goto(url, { waitUntil: ['load'], timeout: 4 * 1000 });
    }
}
exports.Pupp = Pupp;
