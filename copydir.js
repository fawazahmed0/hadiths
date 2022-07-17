const fs = require('fs-extra')
const path = require('path')
fs.copySync(path.join(__dirname, 'code'), path.join(__dirname, 'dist'))