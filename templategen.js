const path = require('path')
const Mustache = require('mustache');
const fs = require('fs-extra');
let templateDir = path.join(__dirname,'template')
let codeDir = path.join(__dirname,'code')
fs.mkdirSync(codeDir, {
    recursive: true
  })
let ignoreHTMLFiles = ['default.html']
let ignoreJSFiles = ['commoncode.js','service-worker.js']
let allFileNames = fs.readdirSync(templateDir)
// All HTML files,except the ignored html files
let htmlFileNames = allFileNames.filter(e => !ignoreHTMLFiles.includes(e) && e.endsWith('.html'))
let jsFileNames = allFileNames.filter(e => !ignoreJSFiles.includes(e) && e.endsWith('.js'))

let defaultTemplate = fs.readFileSync(path.join(templateDir, 'default.html')).toString()
let commonCode = fs.readFileSync(path.join(templateDir, 'commoncode.js')).toString()

let titles = {'index.html':'Hadiths Books','data.html':'Hadiths with multiple grades','dataseo.html':'Hadith with multiple grades & multiple languages','sections.html':'Hadith Sections','seo.html':'Hadith Books','single.html':'Single Hadith with multiple grades & multiple languages'}
let footerclassobj = {}

let seoignore = `<meta name="robots" content="noindex">`
let metaheadignore = {'data.html':seoignore}

for (let name of htmlFileNames){
    let innercode = fs.readFileSync(path.join(templateDir,name)).toString()
    var rendered = Mustache.render(defaultTemplate, { title: titles[name], footerclass: footerclassobj[name] , containercode:innercode, meta:{filename:name,barename:name.replace(/\.[^\.]*$/i,''),head:metaheadignore[name]} });
    fs.writeFileSync(path.join(codeDir,name), rendered)
}

for (let name of jsFileNames){
  let innercode = fs.readFileSync(path.join(templateDir,name)).toString() + '\n' + commonCode
 fs.writeFileSync(path.join(codeDir,name), innercode)
}

// Copy all files like .js, folders etc to code directory
allFileNames.filter(e=>!e.endsWith('.html') && !e.endsWith('.js')).concat(ignoreJSFiles).forEach(e=>fs.copySync(path.join(templateDir,e), path.join(codeDir,e)))



