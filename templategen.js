const path = require('path')
const Mustache = require('mustache');
const fs = require('fs-extra');
let templateDir = path.join(__dirname,'template')
let codeDir = path.join(__dirname,'code')
fs.mkdirSync(codeDir, {
    recursive: true
  })
let ignoreHTMLFiles = ['default.html']
let allFileNames = fs.readdirSync(templateDir)
// All HTML files,except the ignored html files
let fileNames = allFileNames.filter(e => !ignoreHTMLFiles.includes(e) && e.endsWith('.html'))

let defaultTemplate = fs.readFileSync(path.join(templateDir, 'default.html')).toString()

let titles = {'index.html':'Hadiths Books','data.html':'Hadiths with multiple grades','dataseo.html':'Hadith with multiple grades & multiple languages','sections.html':'Hadith Sections','seo.html':'Hadith Books','single.html':'Single Hadith with multiple grades & multiple languages'}
let footerclassobj = {}

let seoignore = `<meta name="robots" content="noindex">`
let metaheadignore = {'data.html':seoignore}

for (let name of fileNames){
    let innercode = fs.readFileSync(path.join(templateDir,name)).toString()
    var rendered = Mustache.render(defaultTemplate, { title: titles[name], footerclass: footerclassobj[name] , containercode:innercode, meta:{filename:name,head:metaheadignore[name]} });
    fs.writeFileSync(path.join(codeDir,name), rendered)
}
// Copy all files like .js, folders etc to code directory
allFileNames.filter(e=>!e.endsWith('.html')).forEach(e=>fs.copySync(path.join(templateDir,e), path.join(codeDir,e)))



