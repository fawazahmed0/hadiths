window.htmlHadithContainer =
  `    
<div class="card text-dark m-3">
<div class="card-body">
<div class="card-text m-1"></div>
</div>

<span id="footercontainer">
</span>

</div>
`

window.tableContainer =
  `
<table class="table table-hover  table-striped">
  <tbody>

  </tbody>
</table>
`

window.searchBar =
  `
<div class="mb-3">
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
<div id="search-results" class="mt-3"></div>
<hr id="search-divider" class="d-none" />
</div>
`

window.capitalize = function (words) {
  return words.toString().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, match => match.toUpperCase()).trim()
}

window.htmlparser = new window.DOMParser();

window.getElement = function (elementName, attributesObj) {
  if (!attributesObj)
    attributesObj = {}
  let element = document.createElement(elementName);
  for (let [key, value] of Object.entries(attributesObj)) {
    element.setAttribute(key, value);
  }
  return element
}

window.apiLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/", "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"]
window.quranLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/", "https://raw.githubusercontent.com/fawazahmed0/quran-api/1/"]
window.extensions = [".min.json", ".json"]

// https://www.shawntabrizi.com/code/programmatically-fetch-multiple-apis-parallel-using-async-await-javascript/
// Get links async i.e in parallel
window.getJSON = async function (endpoints, links) {
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


window.fetchWithFallback = async function (links, obj) {
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
window.getURLs = function (endpoint, links) {
  links = links || apiLinks
  return extensions.map(ext => links.map(e => e + endpoint + ext)).flat()
}

window.getElementFromHTML = function (htmlString) {
  return htmlparser.parseFromString(htmlString, "text/html");
}

// pass hadith object & get card element with all hadith info in it
window.getHadithCardElem = function (hadith, editionName, dirval, lang, isocodes) {
  let lowerLang = lang.toLowerCase()
  let cardElem = getElementFromHTML(htmlHadithContainer).querySelector('.card')
  cardElem.querySelector('.card-text').innerText = hadith.text
  let footerDiv = getElement('div', { class: "card-footer" })
  if (hadith.grades.length > 0) {
    cardElem.querySelector('#footercontainer').appendChild(footerDiv.cloneNode())
    Array.from(cardElem.querySelectorAll('.card-footer')).at(-1).insertAdjacentHTML("beforeend", `<table class="table table-sm">
    <thead>
      <tr>
        <th>Grade</th>
      
      </tr>
    </thead>
    <tbody>
    </tbody>
    </table>`);
  }

  for (let grade of hadith.grades)
    cardElem.querySelector('tbody').insertAdjacentHTML("beforeend", `<tr><td>${capitalize(grade.grade)}</td><td>${grade.name}</td></tr>`);
  let hrefVal = `hadith:${editionName}:${hadith.hadithnumber}`
  if ("hadithnumber" in hadith) {
    cardElem.querySelector('#footercontainer').appendChild(footerDiv.cloneNode())
    Array.from(cardElem.querySelectorAll('.card-footer')).at(-1).insertAdjacentHTML("beforeend", `<a href=#${hrefVal} class="link-dark text-decoration-none" >Hadith Number: ${hadith.hadithnumber}</a><br>`);
  }
  if ("arabicnumber" in hadith) {
    cardElem.querySelector('#footercontainer').appendChild(footerDiv.cloneNode())
    Array.from(cardElem.querySelectorAll('.card-footer')).at(-1).insertAdjacentHTML("beforeend", `<a href=#${hrefVal} class="link-dark text-decoration-none" >Arabic Number: ${hadith.arabicnumber}</a><br>`);
  }

  if ("reference" in hadith) {
    cardElem.querySelector('#footercontainer').appendChild(footerDiv.cloneNode())
    Array.from(cardElem.querySelectorAll('.card-footer')).at(-1).insertAdjacentHTML("beforeend", `<a href=#${hrefVal} class="link-dark text-decoration-none" >Reference: ${Object.entries(hadith.reference).flat().map(e => capitalize(e)).join(' ')}</a><br>`);
  }
  cardElem.setAttribute('id', hrefVal)

  cardElem.querySelector('.card-text').setAttribute('dir', dirval)
  cardElem.querySelector('.card-text').setAttribute('lang', isocodes[lowerLang].iso1 ? isocodes[lowerLang].iso1 : isocodes[lowerLang].iso2)

  return cardElem
}

const fuseScript = document.createElement('script');
fuseScript.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';
document.head.appendChild(fuseScript);

let cachedEdition = null;
let cachedHadiths = null;

window.beginSearch = async function () {
  const query = document.getElementById('searchquery').value.trim();
  if (!query) return;
  const resultsEl = document.getElementById('search-results');
  const divider = document.getElementById('search-divider');
  resultsEl.innerHTML = '<p class="text-muted">Searching...</p>';
  const params = new URLSearchParams(window.location.search);
  const edition = params.get('edition');
  try {
      if (edition !== cachedEdition || !cachedHadiths) {
          resultsEl.innerHTML = '<p class="text-muted">Loading hadith data...</p>';
          const res = await fetch(
              `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${edition}.json`
          );
          const data = await res.json();
          cachedHadiths = data.hadiths;
          cachedEdition = edition;
      }
      const fuse = new Fuse(cachedHadiths, {
          keys: ['text'],
          threshold: 0.3,
          minMatchCharLength: 3,
          includeScore: true,
      });
      const results = fuse.search(query).slice(0, 20);
      if (results.length === 0) {
          resultsEl.innerHTML = '<p class="text-muted">No results found.</p>';
          divider.classList.add('d-none');
          return;
      }
      resultsEl.innerHTML = results.map(({ item }) => `
          <div class="card mb-2">
              <div class="card-body">
                  <h6 class="card-subtitle mb-2 text-muted">Hadith #${item.hadithnumber}</h6>
                  <p class="card-text">${item.text}</p>
                  <a href="data.html?edition=${edition}&type=single&num=${item.hadithnumber}" 
                     class="card-link">View full hadith →</a>
              </div>
          </div>
      `).join('');
      divider.classList.remove('d-none');
  } catch (err) {
      resultsEl.innerHTML = '<p class="text-danger">Failed to load hadith data. Please try again.</p>';
      divider.classList.add('d-none');
      console.error(err);
  }
};

window.isObject = function (obj) {
  return obj === Object(obj);
}

// Show as loading spinning wheel,only if there isn't any other
window.showSpinningWheel = function (selector, position) {
  if (!document.body.contains(document.querySelector('#spinningwheel')) ) {
    document.querySelector(selector).insertAdjacentHTML(position,`<div  id="spinningwheel">
    <div class="text-center">
      <div class="spinner-border m-5" role="status">
      </div>
      </div>
      </div>
      `)
  }
}

window.removeSpinningWheel = function () {
  if (document.body.contains(document.querySelector('#spinningwheel')) )
  document.querySelector('#spinningwheel').remove()
}

// Hash with Text Fragment
window.getHashTextFragment = function () {
  let hashWithFragment;
  // https://web.dev/text-fragments/#obtaining-text-fragments-for-analytics-purposes
  try{
    hashWithFragment =  new URL(performance.getEntries().find(({ type }) => type === 'navigate').name).hash
  }catch(e){}
  return hashWithFragment || window.location.hash
}
