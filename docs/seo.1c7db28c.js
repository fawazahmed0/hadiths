document.addEventListener("DOMContentLoaded",(async function(){let a=await async function(e,a){let r=!1;Array.isArray(e)||(e=[e],r=!0);let i=await Promise.all(e.map((e=>async function(e,t){let n;for(let a of e)try{if(n=await fetch(a,t),n.ok)return n}catch(e){}return n}(function(e,a){return a=a||t,n.map((t=>a.map((n=>n+e+t)))).flat()}(e,a)).then((e=>e.json()))))).catch(console.error);return r?i[0]:i}("editions"),r=e("ul",{class:"list-group"});for(let[t,n]of Object.entries(a)){let a=e("li",{class:"list-group-item"}),i=new URLSearchParams;i.set("bareedition",t);let o=e("a",{href:`single.html?${i.toString()}`});o.innerText=n.name,a.appendChild(o),r.appendChild(a)}document.querySelector("#mycontainer").appendChild(r)}));new DOMParser;function e(e,t){t||(t={});let n=document.createElement(e);for(let[e,a]of Object.entries(t))n.setAttribute(e,a);return n}let t=["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/","https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"],n=[".min.json",".json"];window.beginSearch=function(){let e=new URLSearchParams,t=document.getElementById("searchquery").value;e.set("q",`site:fawazahmed0.github.io/hadiths ${t}`),window.open("https://www.google.com/search?"+e.toString(),"_blank")};
//# sourceMappingURL=seo.1c7db28c.js.map
