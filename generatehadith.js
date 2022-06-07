const fs = require('fs-extra')
const path = require('path')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

let hadithLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/", "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"]
let quranLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/", "https://raw.githubusercontent.com/fawazahmed0/quran-api/1/"]
let extensions = [".min.json", ".json"]
let bigJSON = {}



async function test() {
    let saveDir = path.join(__dirname, 'template','books')
    let editionsJSON = await getJSON('editions')
    let isocodes = await getJSON('isocodes/iso-codes', quranLinks)
    let hadithPath = saveDir

            // create books index i.e list of books available
            let pathToSave = path.join(hadithPath,`index.html`)
            let dataToSave = `<ul class="list-group">${Object.entries(editionsJSON).map( e =>`<li class="list-group-item"><a href="${e[0]}">${e[1].name}</a></li>`).join('')}</ul>`
            addToBigJSON(pathToSave, dataToSave )
    
     

    for (let [bareedition, value] of Object.entries(editionsJSON)) {
        let infoJSON = await getJSON('info')
        // create edition index i.e list of hadiths available
         pathToSave = path.join(hadithPath,bareedition,`index.html`)
         let hadithNumArr = Array.from(Array(infoJSON[bareedition].metadata.last_hadithnumber+1).keys())
         dataToSave = `<ul class="list-group">${hadithNumArr.map(e=>`<li class="list-group-item"><a href="${e}">Hadith Number  ${e}</a></li>`).join('')}</ul>`
        addToBigJSON(pathToSave, dataToSave )
 
        for (let collection of editionsJSON[bareedition].collection.sort((a,b)=>a.language.localeCompare(b.language))) {

            let edition = collection.name;
            let lang = collection.language;
            let dirval = collection.direction;


            let data = await getJSON(`editions/${edition}`)
            let languageHeading =  `<h2 id="${lang.toLowerCase()}" class="text-center"><a href="#${lang.toLowerCase()}" class="link-dark">${lang}</a></h2>`
       

            let hadiths = data.hadiths

            for (let hadith of hadiths) {
                let pathToSave = path.join(hadithPath,bareedition,`${Math.floor(hadith.hadithnumber)}.html`)
                let dataToSave = getHadithCardElem(hadith,edition ,dirval, lang, isocodes)
                // save language if doesn't exists
                if(pathToSave in bigJSON === false ||  !bigJSON[pathToSave].includes(languageHeading))
                addToBigJSON(pathToSave, languageHeading )

                addToBigJSON(pathToSave, dataToSave )
            }
            

        }
   
    }
    
   

    for(let [pathToSave, dataArr] of Object.entries(bigJSON)){
        fs.outputFileSync(pathToSave, dataArr.join('\n\n'))
    }

}

test()

// pass hadith object & get card element with all hadith info in it
function getHadithCardElem(hadith, editionName, dirval, lang, isocodes) {
    let lowerLang = lang.toLowerCase()
    let hrefVal = `${editionName}`
    return `     
    <div class="card text-dark bg-light m-3" id="${hrefVal}">
    <div class="card-body">
    <div dir="${dirval}" class="card-text lead m-1" lang="${isocodes[lowerLang].iso1 ? isocodes[lowerLang].iso1 : isocodes[lowerLang].iso2}">${hadith.text}</div>
    </div>
    <span id="footercontainer">
    ${hadith.grades.length > 0 ? `<div class="card-footer"><table class="table table-sm">
    <thead>
      <tr>
        <th>Grade</th>
      
      </tr>
    </thead>
    <tbody>
    ${hadith.grades.map(grade=>`<tr><td>${capitalize(grade.grade)}</td><td>${grade.name}</td></tr>`).join('')}
    </tbody>
    </table></div>` : ''}
    ${"hadithnumber" in hadith ? `<div class="card-footer"><a href=#${hrefVal} class="link-dark text-decoration-none" >Hadith Number: ${hadith.hadithnumber}</a><br></div>`:``}
    ${"arabicnumber" in hadith ? `<div class="card-footer"><a href=#${hrefVal} class="link-dark text-decoration-none" >Arabic Number: ${hadith.arabicnumber}</a><br></div>` : ''}
    ${"reference" in hadith ? `<div class="card-footer"><a href=#${hrefVal} class="link-dark text-decoration-none" >Reference: ${Object.entries(hadith.reference).flat().map(e => capitalize(e)).join(' ')}</a><br></div>` : ''}
    </span>
    </div>
    `

  }




function capitalize(words) {
    return words.toString().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, match => match.toUpperCase()).trim()
}

function addToBigJSON(key, value) {

    if(key in bigJSON)
        bigJSON[key].push(value)
    else
        bigJSON[key] = [value]

}

// https://www.shawntabrizi.com/code/programmatically-fetch-multiple-apis-parallel-using-async-await-javascript/
// Get links async i.e in parallel
async function getJSON(endpoints, links) {
    let returnSingle = false
    if (!Array.isArray(endpoints)) {
        endpoints = [endpoints]
        returnSingle = true
    }
    let result = await Promise.all(
        endpoints.map(endpoint => fetchWithFallback(getURLs(endpoint, links)).then(response => response.json()))
    ).catch(console.error)
    if (returnSingle)
        return result[0]
    return result
}


async function fetchWithFallback(links, obj) {
    let response;
    for (let link of links) {
        try {
            response = await fetch(link, obj)
            if (response.ok)
                return response
        } catch (e) { }
    }
    return response
}

// convert endpoint into multiple urls, including fallback urls
function getURLs(endpoint, links) {
    links = links || hadithLinks
    return extensions.map(ext => links.map(e => e + endpoint + ext)).flat()
}

function getRandomArbitrary(max) {
    return Math.floor(Math.random() * max)
}

function cleanText(str){
    return str.replace(/`/gi,"'").replace(/\{/gi,"(").replace(/\}/gi,")").replace(/\</gi,"(").replace(/\>/gi,")")
}