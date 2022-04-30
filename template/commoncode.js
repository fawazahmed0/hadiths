const htmlHadithContainer =
  `    
<div class="card text-dark bg-light m-5">
<div class="card-body">
<div class="card-text lead m-1"></div>
</div>

<span id="footercontainer">
</span>

</div>
`

const tableContainer =
  `
<table class="table table-hover  table-striped">
  <tbody>

  </tbody>
</table>
`

const searchBar =
  `
<div class="mb-3 d-none">
<form class="d-flex" onsubmit="beginSearch(); return false">
  <input id="searchquery" class="form-control mr-2" type="search" placeholder="Search" aria-label="Search" />
  <button id="searchbtn" class="btn btn-outline-info" type="button" onclick="beginSearch(); return false">
    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor"
      xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd"
        d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />
      <path fill-rule="evenodd"
        d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
    </svg>
  </button>
</form>
</div>
`

function capitalize(words) {
  return words.toString().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, match => match.toUpperCase()).trim()
}

let htmlparser = new DOMParser();

function getElement(elementName, attributesObj) {
  if (!attributesObj)
    attributesObj = {}
  let element = document.createElement(elementName);
  for (let [key, value] of Object.entries(attributesObj)) {
    element.setAttribute(key, value);
  }
  return element
}

let apiLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/", "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"]
let quranLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/", "https://raw.githubusercontent.com/fawazahmed0/quran-api/1/"]
let extensions = [".min.json", ".json"]

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
  links = links || apiLinks
  return extensions.map(ext => links.map(e => e + endpoint + ext)).flat()
}

function getElementFromHTML(htmlString) {
  return htmlparser.parseFromString(htmlString, "text/html");
}

// pass hadith object & get card element with all hadith info in it
function getHadithCardElem(hadith, editionName, dirval, lang, isocodes) {
  let lowerLang = lang.toLowerCase()
  let cardElem = getElementFromHTML(htmlHadithContainer).querySelector('.card')
  cardElem.querySelector('.card-text').innerText = hadith.text
  let footerDiv = getElement('div', { class: "card-footer" })
  if (hadith.grades.length > 0) {
    cardElem.querySelector('#footercontainer').appendChild(footerDiv.cloneNode())
    Array.from(cardElem.querySelectorAll('.card-footer')).at(-1).insertAdjacentHTML("beforeend", `<b>Grades:</b><br>`);
  }

  for (let grade of hadith.grades)
    cardElem.querySelector('.card-footer').insertAdjacentHTML("beforeend", `<b>${capitalize(grade.grade)}</b> : ${grade.name}<br>`);
  let hrefVal = `hadith:${editionName}:${hadith.hadithnumber}`
  if (hadith.hadithnumber) {
    cardElem.querySelector('#footercontainer').appendChild(footerDiv.cloneNode())
    Array.from(cardElem.querySelectorAll('.card-footer')).at(-1).insertAdjacentHTML("beforeend", `<a href=#${hrefVal} class="link-dark text-decoration-none" >Hadith Number: ${hadith.hadithnumber}</a><br>`);
  }
  if (hadith.arabicnumber) {
    cardElem.querySelector('#footercontainer').appendChild(footerDiv.cloneNode())
    Array.from(cardElem.querySelectorAll('.card-footer')).at(-1).insertAdjacentHTML("beforeend", `<a href=#${hrefVal} class="link-dark text-decoration-none" >Arabic Number: ${hadith.arabicnumber}</a><br>`);
  }

  if (hadith.reference) {
    cardElem.querySelector('#footercontainer').appendChild(footerDiv.cloneNode())
    Array.from(cardElem.querySelectorAll('.card-footer')).at(-1).insertAdjacentHTML("beforeend", `<a href=#${hrefVal} class="link-dark text-decoration-none" >Reference: ${Object.entries(hadith.reference).flat().map(e => capitalize(e)).join(' ')}</a><br>`);
  }
  cardElem.setAttribute('id', hrefVal)

  cardElem.querySelector('.card-text').setAttribute('dir', dirval)
  cardElem.querySelector('.card-text').setAttribute('lang', isocodes[lowerLang].iso1 ? isocodes[lowerLang].iso1 : isocodes[lowerLang].iso2)

  return cardElem
}

window.beginSearch = function () {
  let newparams = new URLSearchParams();
  let searchquery = document.getElementById('searchquery').value
  newparams.set('q', `site:fawazahmed0.github.io/hadiths ${searchquery}`)
  window.open('https://www.google.com/search?' + newparams.toString(), '_blank');
}