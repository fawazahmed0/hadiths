import './commoncode.js'
async function ready() {
let params = new window.URLSearchParams(document.location.search);
let edition = params.get("edition");
let bareedition = params.get("bareedition") || edition.replace(/\d+/g, '').split('-')[1].trim()
if (!bareedition)
return
window.showSpinningWheel('#mycontainer','beforeend')
let data = await getJSON('info')

let UL = getElement('ul', { class: 'list-group' })
for (let [key, value] of Object.entries(data[bareedition]['metadata']['sections'])) {
let LI = getElement('li', { class: 'list-group-item' })
let newparams = new window.URLSearchParams();
newparams.set('edition', edition)
newparams.set('type', 'section')
newparams.set('num', key)

let sectionDetails = data[bareedition]['metadata']['section_details'][key]  
  
let aElem = getElement('a', { href: `data.html?${newparams.toString()}` })
aElem.innerText = `Section ${key} : ${value}`
let spanElem = getElement('span', { class: 'float-end text-dark' })
if(key!="0")
spanElem.innerText = /muslim/i.test(bareedition) ? `${Math.floor(sectionDetails.arabicnumber_first)} to ${Math.floor(sectionDetails.arabicnumber_last)}` : `${Math.floor(sectionDetails.hadithnumber_first)} to ${Math.floor(sectionDetails.hadithnumber_last)}`
aElem.appendChild(spanElem)
LI.appendChild(aElem)
UL.appendChild(LI)
}
window.removeSpinningWheel()
document.querySelector('#mycontainer').appendChild(UL)

// scroll to hash Text fragment
window.location.hash = window.getHashTextFragment()

}




document.addEventListener("DOMContentLoaded", ready);
