const path  = require('path');
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    appName:'document',
    iconPath:resolve('static')+'logo.ico',
    outPath:''
}
