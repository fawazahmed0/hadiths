document.addEventListener("DOMContentLoaded",(async function(){document.querySelector("#mycontainer").insertAdjacentHTML("beforeend",e);let t,r=new URLSearchParams(document.location.search),n=r.get("edition"),o=r.get("bareedition")||n.replace(/\d+/g,"").split("-")[1].trim(),d=r.get("type")||"section",l=r.get("num"),s=r.get("grade");if(!o||!l&&"full"!=d)return;"full"==d?t=`editions/${n}`:(d="section",t=`editions/${n}/sections/${l}`);let u=await i("isocodes/iso-codes",a),[f,h]=await i(["editions",t]),[m,b,p]=f[o].collection.filter((e=>e.name==n)).map((e=>[e.name,e.language,e.direction]))[0],g=h.hadiths;s&&(s=s.trim().toLowerCase(),g=g.filter((e=>e.grades.some((e=>e.grade.toLowerCase().includes(s)))))),g=g.filter((e=>null==e?void 0:e.text));for(let e of g)document.querySelector("#mycontainer").appendChild(c(e,n,p,b,u))}));const e='\n<div class="mb-3 d-none">\n<form class="d-flex" onsubmit="beginSearch(); return false">\n  <input id="searchquery" class="form-control mr-2" type="search" placeholder="Search" aria-label="Search" />\n  <button id="searchbtn" class="btn btn-outline-info" type="button" onclick="beginSearch(); return false">\n    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-search" fill="currentColor"\n      xmlns="http://www.w3.org/2000/svg">\n      <path fill-rule="evenodd"\n        d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />\n      <path fill-rule="evenodd"\n        d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />\n    </svg>\n  </button>\n</form>\n</div>\n';function t(e){return e.toString().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g,(e=>e.toUpperCase())).trim()}let r=new DOMParser;let n=["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/","https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"],a=["https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/","https://raw.githubusercontent.com/fawazahmed0/quran-api/1/"],o=[".min.json",".json"];async function i(e,t){let r=!1;Array.isArray(e)||(e=[e],r=!0);let a=await Promise.all(e.map((e=>async function(e,t){let r;for(let n of e)try{if(r=await fetch(n,t),r.ok)return r}catch(e){}return r}(function(e,t){return t=t||n,o.map((r=>t.map((t=>t+e+r)))).flat()}(e,t)).then((e=>e.json()))))).catch(console.error);return r?a[0]:a}function c(e,n,a,o,i){let c=o.toLowerCase(),d=(l='    \n<div class="card text-dark bg-light m-5">\n<div class="card-body">\n<div class="card-text lead m-1"></div>\n</div>\n\n<span id="footercontainer">\n</span>\n\n</div>\n',r.parseFromString(l,"text/html")).querySelector(".card");var l;d.querySelector(".card-text").innerText=e.text;let s=function(e,t){t||(t={});let r=document.createElement(e);for(let[e,n]of Object.entries(t))r.setAttribute(e,n);return r}("div",{class:"card-footer"});e.grades.length>0&&(d.querySelector("#footercontainer").appendChild(s.cloneNode()),Array.from(d.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend","<b>Grades:</b><br>"));for(let r of e.grades)d.querySelector(".card-footer").insertAdjacentHTML("beforeend",`<b>${t(r.grade)}</b> : ${r.name}<br>`);let u=`hadith:${n}:${e.hadithnumber}`;return e.hadithnumber&&(d.querySelector("#footercontainer").appendChild(s.cloneNode()),Array.from(d.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",`<a href=#${u} class="link-dark text-decoration-none" >Hadith Number: ${e.hadithnumber}</a><br>`)),e.arabicnumber&&(d.querySelector("#footercontainer").appendChild(s.cloneNode()),Array.from(d.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",`<a href=#${u} class="link-dark text-decoration-none" >Arabic Number: ${e.arabicnumber}</a><br>`)),e.reference&&(d.querySelector("#footercontainer").appendChild(s.cloneNode()),Array.from(d.querySelectorAll(".card-footer")).at(-1).insertAdjacentHTML("beforeend",`<a href=#${u} class="link-dark text-decoration-none" >Reference: ${Object.entries(e.reference).flat().map((e=>t(e))).join(" ")}</a><br>`)),d.setAttribute("id",u),d.querySelector(".card-text").setAttribute("dir",a),d.querySelector(".card-text").setAttribute("lang",i[c].iso1?i[c].iso1:i[c].iso2),d}window.beginSearch=function(){let e=new URLSearchParams,t=document.getElementById("searchquery").value;e.set("q",`site:fawazahmed0.github.io/hadiths ${t}`),window.open("https://www.google.com/search?"+e.toString(),"_blank")};
//# sourceMappingURL=data.b10cef0d.js.map
