
import './commoncode.js'
async function ready() {

    window.showSpinningWheel('#mycontainer','beforeend')
    
    let data = await window.getJSON('editions');

    let sortedEditionsArr = ['bukhari', 'muslim', 'nasai', 'abudawud', 'tirmidhi', 'ibnmajah', 'malik']
    let sortedEditionsJSON = {}  
    sortedEditionsArr.concat(Object.keys(data)).forEach(editionName=>sortedEditionsJSON[editionName]=data[editionName])
    data=sortedEditionsJSON

    let bigUL = getElement('ul', { class: 'list-group' })
    let count = 0
    for (let [key, value] of Object.entries(data)) {
      count++;
      let bigLI = getElement('li', { class: 'list-group-item' })
      let bigA = getElement('a', { href: `#collapse${count}`, 'data-bs-toggle': 'collapse', role: 'button' })
      bigA.innerText = value.name
      bigLI.appendChild(bigA)
      let ul = getElement('ul', { class: 'list-group collapse', id: `collapse${count}` })
      for (let items of value.collection) {
        let li = getElement('li', { class: 'list-group-item' })
        let newparams = new window.URLSearchParams();
        newparams.set('edition', items.name)
        newparams.set('bareedition', key)
        let aElem = getElement('a', { href: `sections.html?${newparams.toString()}` })
        aElem.innerText = items.language
        li.appendChild(aElem)
        //items.language , items.link
        ul.appendChild(li)
      }
      bigLI.appendChild(ul)
      bigUL.appendChild(bigLI)
  
    }
    removeSpinningWheel()
    document.querySelector('#mycontainer').appendChild(bigUL)
  }
  
  
  
  
  document.addEventListener("DOMContentLoaded", ready);
