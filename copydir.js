const fs = require('fs-extra')
const path = require('path')
fs.copySync(path.join(__dirname, 'code','books'), path.join(__dirname, 'dist','books'))