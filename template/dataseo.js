
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
      let lowerLang = lang.toLowerCase()
      let data = dataArr[count]
      let h2 = getElement('h2', { id: lang.toLowerCase(),'class':'text-center' })
      h2.innerText = lang
      document.querySelector('#mycontainer').appendChild(h2)
      for (let hadith of data.hadiths) {

        let cardElem = getElementFromHTML(htmlHadithContainer).querySelector('.card')
        cardElem.querySelector('.card-text').innerText = hadith.text
        if(hadith.grades.length>0)
        cardElem.querySelector('.card-footer').insertAdjacentHTML("beforeend", `<b>Grades:</b><br>`);
        for (let grade of hadith.grades) 
          cardElem.querySelector('.card-footer').insertAdjacentHTML("beforeend", `<b>${capitalize(grade.grade)}</b> : ${grade.name}<br>`);
          if(hadith.hadithnumber)
          cardElem.querySelectorAll('.card-footer')[1].insertAdjacentHTML("beforeend", `Hadith Number: ${hadith.hadithnumber}<br>`);
          if(hadith.arabicnumber)
          cardElem.querySelectorAll('.card-footer')[2].insertAdjacentHTML("beforeend", `Arabic Number: ${hadith.arabicnumber}<br>`);
    
          if(hadith.reference)
          cardElem.querySelectorAll('.card-footer')[3].insertAdjacentHTML("beforeend", `Reference: ${Object.entries(hadith.reference).flat().map(e=>capitalize(e)).join(' ')}<br>`);
    
    
          cardElem.setAttribute('dir',dirval)
          cardElem.setAttribute('lang',isocodes[lowerLang].iso1 ? isocodes[lowerLang].iso1 : isocodes[lowerLang].iso2)
    
       document.querySelector('#mycontainer').appendChild(cardElem)
      }
      count++;
    }



  }

  document.addEventListener("DOMContentLoaded", ready);
