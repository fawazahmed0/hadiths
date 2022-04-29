
  async function ready() {
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
    for (let [editionName, lang] of edtionsLangArr) {
      let aElem = getElement('a', { href: `#${lang.toLowerCase()}` })
      aElem.innerText = lang
      let tr = getElement('tr')
      let td = getElement('td',{class:'text-center'})
      td.appendChild(aElem)
      tr.appendChild(td)
      tableElem.querySelector('tbody').appendChild(tr)
      // Create endpoints for parallel fetch
      linksArr.push(`editions/${editionName}/${num}`)
    }
    document.querySelector('#mycontainer').appendChild(tableElem)
    let dataArr = await getJSON(linksArr)
    let count = 0
    for (let [editionName, lang, dirval] of edtionsLangArr) {
      let data = dataArr[count]
      let h2 = getElement('h2', { id: lang.toLowerCase(),'class':'text-center' })
      let aElem = getElement('a',{href:`#${lang.toLowerCase()}`})
      aElem.innerText = lang
      h2.appendChild(aElem)
      document.querySelector('#mycontainer').appendChild(h2)
      for (let hadith of data.hadiths) 
      document.querySelector('#mycontainer').appendChild(getHadithCardElem(hadith,dirval,lang,isocodes))
      
      count++;
    }



  }

  document.addEventListener("DOMContentLoaded", ready);
