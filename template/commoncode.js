let htmlHadithContainer = 
`    
<div class="card text-dark bg-light m-5">
<div class="card-body">
<div class="card-text lead m-1"></div>
</div>

<span id="footercontainer">
</span>

<a href="" class="stretched-link"></a>
</div>
`

let tableContainer = 
`
<table class="table table-hover  table-striped">
  <tbody>

  </tbody>
</table>
`

function capitalize(words){
return words.toString().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, match => match.toUpperCase()).trim()
}

let htmlparser = new DOMParser();

function getElement(elementName, attributesObj) {
  if(!attributesObj)
    attributesObj = {}
  let element = document.createElement(elementName);
  for (let [key, value] of Object.entries(attributesObj)) {
    element.setAttribute(key, value);
  }
  return element
}

let apiLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/", "https://gitcdn.link/cdn/fawazahmed0/hadith-api/1/", "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"]
let quranLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/", "https://gitcdn.link/cdn/fawazahmed0/quran-api/1/", "https://raw.githubusercontent.com/fawazahmed0/quran-api/1/"]
let extensions = [".min.json", ".json"]

// https://www.shawntabrizi.com/code/programmatically-fetch-multiple-apis-parallel-using-async-await-javascript/
// Get links async i.e in parallel
async function getJSON(endpoints, links) {
  if (!Array.isArray(endpoints))
    endpoints = [endpoints]
  let result = await Promise.all(
    endpoints.map(endpoint => fetchWithFallback(getURLs(endpoint, links)).then(response => response.json()))
  ).catch(console.error)
  if (result.length == 1)
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
  links = links || apiLinks
  return extensions.map(ext => links.map(e => e + endpoint + ext)).flat()
}

function getElementFromHTML(htmlString){
  return htmlparser.parseFromString(htmlString, "text/html");
}

