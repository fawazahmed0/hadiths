const path = require('path')
const Mustache = require('mustache');
const fs = require('fs')
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

let titles = {'index.html':'Send Letters Online','send.html':'Send Letters Now','pricing.html':'Pricing','contact.html':'Contact','developers.html':'API','success.html':'Thank you','failed.html':'Failed','about.html':'About Us','refund.html':'Refund & Cancellation','terms.html':'Terms & Conditions'}
let footerclassobj = {'send.html':'d-none'};

let seoignore = `<meta name="robots" content="noindex">`
let metaheadignore = {'success.html':seoignore,'failed.html':seoignore}

for (let name of fileNames){
    let innercode = fs.readFileSync(path.join(templateDir,name)).toString()
    var rendered = Mustache.render(defaultTemplate, { title: titles[name], footerclass: footerclassobj[name] , containercode:innercode, meta:{filename:name,head:metaheadignore[name]} });
    fs.writeFileSync(path.join(codeDir,name), rendered)
}
// Copy all files like .js, folders etc to code directory
allFileNames.filter(e=>!e.endsWith('.html')).forEach(e=>fs.copySync(path.join(templateDir,e), path.join(codeDir,e)))



