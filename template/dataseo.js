
  async function ready() {
    document.querySelector('#mycontainer').insertAdjacentHTML('beforeend',searchBar)
    let params = new URLSearchParams(document.location.search);
    let edition = params.get("edition");
    let bareedition = params.get("bareedition") || edition.replace(/\d+/g, '').split('-')[1].trim()
    let num = params.get("num");
    if (!bareedition || !num)
      return
    let editionsJSON = await getJSON('editions')


    let isocodes = await getJSON('isocodes/iso-codes', quranLinks)
    let edtionsLangArr = editionsJSON[bareedition].collection.map(e => [e.name, e.language, e.direction])
    let linksArr = []
    // Table of content
    let tableElem = getElementFromHTML(tableContainer).querySelector('.table')
    let uniqueLangs = [...new Set(edtionsLangArr.map(e=>e[1]))]
    for (let lang of uniqueLangs) {
      let aElem = getElement('a', { href: `#${lang.toLowerCase()}` })
      aElem.innerText = lang
      let tr = getElement('tr')
      let td = getElement('td',{class:'text-center'})
      td.appendChild(aElem)
      tr.appendChild(td)
      tableElem.querySelector('tbody').appendChild(tr)
    }
           // Create endpoints for parallel fetch
           for(let [editionName] of edtionsLangArr)
           linksArr.push(`editions/${editionName}/${chapter}/${verse}`)

    document.querySelector('#mycontainer').appendChild(tableElem)
    let dataArr = await getJSON(linksArr)
    let count = 0
    let langCheck = []
    for (let [editionName, lang, dirval] of edtionsLangArr) {
      let data = dataArr[count]
      // create language heading only if one doesn't exists
      if(!langCheck.includes(lang)){
      let h2 = getElement('h2', { id: lang.toLowerCase(),'class':'text-center' })
      let aElem = getElement('a',{href:`#${lang.toLowerCase()}`, class:"link-dark"})
      aElem.innerText = lang
      h2.appendChild(aElem)
      document.querySelector('#mycontainer').appendChild(h2)
      }
      for (let hadith of data.hadiths) 
      document.querySelector('#mycontainer').appendChild(getHadithCardElem(hadith,editionName,dirval,lang,isocodes))
      
      langCheck.push(lang)
      count++;
    }



  }

  document.addEventListener("DOMContentLoaded", ready);
