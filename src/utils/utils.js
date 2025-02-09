const { networkInterfaces } = require('os');

const nets = networkInterfaces();
let ipAddress = '';

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
        if (net.family === familyV4Value && !net.internal) {
            ipAddress = net.address;
            break;
        }
    }
    if (ipAddress) break;
}

module.exports = ipAddress;