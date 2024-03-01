window.htmlHadithContainer='    \n<div class="card text-dark m-3">\n<div class="card-body">\n<div class="card-text m-1"></div>\n</div>\n\n<span id="footercontainer">\n</span>\n\n</div>\n',window.tableContainer='\n<table class="table table-hover  table-striped">\n  <tbody>\n\n  </tbody>\n</table>\n',window.searchBar='\n<div class="mb-3">\n<form class="d-flex" onsubmit="beginSearch(); return false">\n  <input id="searchquery" class="form-control mr-2" type="search" placeholder="Search" aria-label="Search" />\n  <button id="searchbtn" class="btn btn-outline-info" type="button" onclick="beginSearch(); return false">\n    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor"\n      xmlns="http://www.w3.org/2000/svg">\n      <path fill-rule="evenodd"\n        d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />\n      <path fill-rule="evenodd"\n        d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />\n    </svg>\n  </button>\n</form>\n</div>\n',window.capitalize=function(e){return e.toString().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g,(e=>e.toUpperCase())).trim()},window.htmlparser=new window.DOMParser,window.getElement=function(e,t){t||(t={});let n=document.createElement(e);for(let[e,r]of Object.entries(t))n.setAttribute(e,r);return n},window.apiLinks=["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/","https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"],window.quranLinks=["https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/","https://raw.githubusercontent.com/fawazahmed0/quran-api/1/"],window.extensions=[".min.json",".json"],window.getJSON=async function(e,t){let n=!1;Array.isArray(e)||(e=[e],n=!0);let r=await Promise.all(e.map((e=>fetchWithFallback(getURLs(e,t)).then((e=>e.json()))))).catch(console.error);return n?r[0]:r},window.fetchWithFallback=async function(e,t){let n;for(let r of e)try{if(n=await fetch(r,t),n.ok)return n}catch(e){}return n},window.getURLs=function(e,t){return t=t||apiLinks,extensions.map((n=>t.map((t=>t+e+n)))).flat()},window.getElementFromHTML=function(e){return htmlparser.parseFromString(e,"text/html")},window.getHadithCardElem=function(e,t,n,r,a){let o=r.toLowerCase(),i=getElementFromHTML(htmlHadithContainer).querySelector(".card");i.querySelector(".card-text").innerText=e.text;let l=getElement("div",{class:"card-footer"});e.grades.length>0&&(i.querySelector("#footercontainer").appendChild(l.cloneNode()),Array.from(i.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",'<table class="table table-sm">\n    <thead>\n      <tr>\n        <th>Grade</th>\n      \n      </tr>\n    </thead>\n    <tbody>\n    </tbody>\n    </table>'));for(let t of e.grades)i.querySelector("tbody").insertAdjacentHTML("beforeend",`<tr><td>${capitalize(t.grade)}</td><td>${t.name}</td></tr>`);let d=`hadith:${t}:${e.hadithnumber}`;return"hadithnumber"in e&&(i.querySelector("#footercontainer").appendChild(l.cloneNode()),Array.from(i.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",`<a href=#${d} class="link-dark text-decoration-none" >Hadith Number: ${e.hadithnumber}</a><br>`)),"arabicnumber"in e&&(i.querySelector("#footercontainer").appendChild(l.cloneNode()),Array.from(i.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",`<a href=#${d} class="link-dark text-decoration-none" >Arabic Number: ${e.arabicnumber}</a><br>`)),"reference"in e&&(i.querySelector("#footercontainer").appendChild(l.cloneNode()),Array.from(i.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",`<a href=#${d} class="link-dark text-decoration-none" >Reference: ${Object.entries(e.reference).flat().map((e=>capitalize(e))).join(" ")}</a><br>`)),i.setAttribute("id",d),i.querySelector(".card-text").setAttribute("dir",n),i.querySelector(".card-text").setAttribute("lang",a[o].iso1?a[o].iso1:a[o].iso2),i},window.beginSearch=function(){let e=new window.URLSearchParams,t=document.getElementById("searchquery").value;e.set("q",`repo:fawazahmed0/quran-hadith-search path:/^Hadiths\\// ${t.trim()}`),window.open(`https://github.com/search?${e.toString()}&type=code`)},window.isObject=function(e){return e===Object(e)},window.showSpinningWheel=function(e,t){document.body.contains(document.querySelector("#spinningwheel"))||document.querySelector(e).insertAdjacentHTML(t,'<div  id="spinningwheel">\n    <div class="text-center">\n      <div class="spinner-border m-5" role="status">\n      </div>\n      </div>\n      </div>\n      ')},window.removeSpinningWheel=function(){document.body.contains(document.querySelector("#spinningwheel"))&&document.querySelector("#spinningwheel").remove()},window.getHashTextFragment=function(){let e;try{e=new URL(performance.getEntries().find((({type:e})=>"navigate"===e)).name).hash}catch(e){}return e||window.location.hash},document.addEventListener("DOMContentLoaded",(async function(){window.showSpinningWheel("#mycontainer","beforeend");let e=await window.getJSON("editions"),t=getElement("ul",{class:"list-group"}),n=0;for(let[r,a]of Object.entries(e)){n++;let e=getElement("li",{class:"list-group-item"}),o=getElement("a",{href:`#collapse${n}`,"data-bs-toggle":"collapse",role:"button"});o.innerText=a.name,e.appendChild(o);let i=getElement("ul",{class:"list-group collapse",id:`collapse${n}`});for(let e of a.collection){let t=getElement("li",{class:"list-group-item"}),n=new window.URLSearchParams;n.set("edition",e.name),n.set("bareedition",r);let a=getElement("a",{href:`sections.html?${n.toString()}`});a.innerText=e.language,t.appendChild(a),i.appendChild(t)}e.appendChild(i),t.appendChild(e)}removeSpinningWheel(),document.querySelector("#mycontainer").appendChild(t)}));
//# sourceMappingURL=index.6aa63c2d.js.map
