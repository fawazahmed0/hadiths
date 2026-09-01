var e="u">typeof globalThis?globalThis:"u">typeof self?self:"u">typeof window?window:"u">typeof global?global:{},t={},n={},r=e.parcelRequire8e87;async function a(){let e=new window.URLSearchParams(document.location.search),t=e.get("edition"),n=e.get("bareedition")||t.replace(/\d+/g,"").split("-")[1].trim();if(!n)return;window.showSpinningWheel("#mycontainer","beforeend");let r=await getJSON("info"),a=getElement("ul",{class:"list-group"});for(let[e,o]of Object.entries(r[n].metadata.sections)){let i=getElement("li",{class:"list-group-item"}),l=new window.URLSearchParams;l.set("edition",t),l.set("type","section"),l.set("num",e);let d=r[n].metadata.section_details[e],c=getElement("a",{href:`data.html?${l.toString()}`});c.innerText=`Section ${e} : ${o}`;let s=getElement("span",{class:"float-end text-dark"});"0"!=e&&(s.innerText=/muslim/i.test(n)?`${Math.floor(d.arabicnumber_first)} to ${Math.floor(d.arabicnumber_last)}`:`${Math.floor(d.hadithnumber_first)} to ${Math.floor(d.hadithnumber_last)}`),c.appendChild(s),i.appendChild(c),a.appendChild(i)}window.removeSpinningWheel(),document.querySelector("#mycontainer").appendChild(a),window.location.hash=window.getHashTextFragment()}null==r&&((r=function(e){if(e in t)return t[e].exports;if(e in n){var r=n[e];delete n[e];var a={id:e,exports:{}};return t[e]=a,r.call(a.exports,a,a.exports),a.exports}var o=Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(e,t){n[e]=t},e.parcelRequire8e87=r),(0,r.register)("kqKQD",function(e,t){window.htmlHadithContainer=`    
<div class="card text-dark m-3">
<div class="card-body">
<div class="card-text m-1"></div>
</div>

<span id="footercontainer">
</span>

</div>
`,window.tableContainer=`
<table class="table table-hover  table-striped">
  <tbody>

  </tbody>
</table>
`,window.searchBar=`
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
</div>
`,window.capitalize=function(e){return e.toString().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g,e=>e.toUpperCase()).trim()},window.htmlparser=new window.DOMParser,window.getElement=function(e,t){t||(t={});let n=document.createElement(e);for(let[e,r]of Object.entries(t))n.setAttribute(e,r);return n},window.apiLinks=["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/","https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"],window.quranLinks=["https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/","https://raw.githubusercontent.com/fawazahmed0/quran-api/1/"],window.extensions=[".min.json",".json"],window.getJSON=async function(e,t){let n=!1;Array.isArray(e)||(e=[e],n=!0);let r=await Promise.all(e.map(e=>fetchWithFallback(getURLs(e,t)).then(e=>e.json()))).catch(console.error);return n?r[0]:r},window.fetchWithFallback=async function(e,t){let n;for(let r of e)try{if((n=await fetch(r,t)).ok)break}catch(e){}return n},window.getURLs=function(e,t){return t=t||apiLinks,extensions.map(n=>t.map(t=>t+e+n)).flat()},window.getElementFromHTML=function(e){return htmlparser.parseFromString(e,"text/html")},window.getHadithCardElem=function(e,t,n,r,a){let o=r.toLowerCase(),i=getElementFromHTML(htmlHadithContainer).querySelector(".card");i.querySelector(".card-text").innerText=e.text;let l=getElement("div",{class:"card-footer"});for(let t of(e.grades.length>0&&(i.querySelector("#footercontainer").appendChild(l.cloneNode()),Array.from(i.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",`<table class="table table-sm">
    <thead>
      <tr>
        <th>Grade</th>
      
      </tr>
    </thead>
    <tbody>
    </tbody>
    </table>`)),e.grades))i.querySelector("tbody").insertAdjacentHTML("beforeend",`<tr><td>${capitalize(t.grade)}</td><td>${t.name}</td></tr>`);let d=`hadith:${t}:${e.hadithnumber}`;return"hadithnumber"in e&&(i.querySelector("#footercontainer").appendChild(l.cloneNode()),Array.from(i.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",`<a href=#${d} class="link-dark text-decoration-none" >Hadith Number: ${e.hadithnumber}</a><br>`)),"arabicnumber"in e&&(i.querySelector("#footercontainer").appendChild(l.cloneNode()),Array.from(i.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",`<a href=#${d} class="link-dark text-decoration-none" >Arabic Number: ${e.arabicnumber}</a><br>`)),"reference"in e&&(i.querySelector("#footercontainer").appendChild(l.cloneNode()),Array.from(i.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",`<a href=#${d} class="link-dark text-decoration-none" >Reference: ${Object.entries(e.reference).flat().map(e=>capitalize(e)).join(" ")}</a><br>`)),i.setAttribute("id",d),i.querySelector(".card-text").setAttribute("dir",n),i.querySelector(".card-text").setAttribute("lang",a[o].iso1?a[o].iso1:a[o].iso2),i},window.beginSearch=function(){let e=new window.URLSearchParams,t=document.getElementById("searchquery").value;e.set("q",`repo:fawazahmed0/quran-hadith-search path:/^Hadiths\\// ${t.trim()}`),window.open(`https://github.com/search?${e.toString()}&type=code`)},window.isObject=function(e){return e===Object(e)},window.showSpinningWheel=function(e,t){document.body.contains(document.querySelector("#spinningwheel"))||document.querySelector(e).insertAdjacentHTML(t,`<div  id="spinningwheel">
    <div class="text-center">
      <div class="spinner-border m-5" role="status">
      </div>
      </div>
      </div>
      `)},window.removeSpinningWheel=function(){document.body.contains(document.querySelector("#spinningwheel"))&&document.querySelector("#spinningwheel").remove()},window.getHashTextFragment=function(){let e;try{e=new URL(performance.getEntries().find(({type:e})=>"navigate"===e).name).hash}catch(e){}return e||window.location.hash}}),r("kqKQD"),document.addEventListener("DOMContentLoaded",a);
//# sourceMappingURL=sections.9b7b8c2b.js.map
