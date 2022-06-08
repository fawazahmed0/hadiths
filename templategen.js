const path = require('path')
const Mustache = require('mustache');
const fs = require('fs-extra');
const fg = require('fast-glob');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
let templateDir = path.join(__dirname,'template')
let codeDir = path.join(__dirname,'code')
fs.mkdirSync(codeDir, {
    recursive: true
  })
let ignoreHTMLFiles = ['default.html']
let allFileNames = fg.sync(path.join(templateDir,'**'), { onlyFiles: true, dot:true}); 
let htmlFileNames = allFileNames.filter(e => e.endsWith('.html') && !e.endsWith(ignoreHTMLFiles[0]))

let defaultTemplate = fs.readFileSync(path.join(templateDir, ignoreHTMLFiles[0])).toString()


let titles = {'index.html':'Hadiths Books','data.html':'Hadiths with multiple grades','dataseo.html':'Hadith with multiple grades & multiple languages','sections.html':'Hadith Sections','seo.html':'Hadith Books','single.html':'Single Hadith with multiple grades & multiple languages','404.html' : 'Page not found',`books${path.sep}index.html`:'Hadith Books | Single'}


async function begin(){

//generate titles
let editionJSON = await fetch('https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions.json').then(res=>res.json())
let infoJSON = await fetch('https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/info.min.json').then(res=>res.json())
let mappedTitles = Object.entries(editionJSON).map(e=>[e[0],e[1].name])
for(let [key,value] of mappedTitles){

 let entriesArr =  Array.from(Array(infoJSON[key].metadata.last_hadithnumber+1000).keys()).map(e=>[`${key}${path.sep}${e}.html`,`${value} ${e}`])
 entriesArr.push([`${key}${path.sep}index.html`,value])
 Object.assign(titles, Object.fromEntries(entriesArr))
}


let titleKeys = Object.keys(titles).reverse()
for (let name of htmlFileNames){
    let innercode = fs.readFileSync(name).toString()
    let titleVal = titles[titleKeys.find(e=>name.endsWith(e))]
    var rendered = Mustache.render(defaultTemplate, { title: titleVal || path.parse(name).name , containercode:innercode, meta:{filename:name.replace(templateDir,"").replaceAll(path.sep,'/')} });
    fs.outputFileSync(name.replace(templateDir,codeDir), rendered)
}

// Copy all files like .js, folders etc to code directory
allFileNames.filter(e=>!e.endsWith('.html')).forEach(e=>fs.copySync(e, e.replace(templateDir,codeDir)))


}
begin()
