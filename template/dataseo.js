
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
    for (let [editionName, lang] of edtionsLangArr) {
      let aElem = getElement('a', { href: `#${lang.toLowerCase()}` })
      aElem.innerText = lang
      let div = getElement('div')
      div.appendChild(aElem)
      document.querySelector('#mycontainer').appendChild(div)
      linksArr.push(`editions/${editionName}/${num}`)
    }
    let dataArr = await getJSON(linksArr)
    let count = 0
    for (let [editionName, lang, dirval] of edtionsLangArr) {
      let lowerLang = lang.toLowerCase()
      let data = dataArr[count]
      let div = getElement('div', { id: lang.toLowerCase() })
      div.innerText = lang
      document.querySelector('#mycontainer').appendChild(div)
      for (let hadith of data.hadiths) {
        let arr = []
        for (let [key, value] of Object.entries(hadith)) {
          if (value === Object(value))
            value = JSON.stringify(value)
          arr.push(`${key} : ${value}`)
        }
        let card = getElement('div', { class: 'card', dir: dirval, lang: isocodes[lowerLang].iso1 ? isocodes[lowerLang].iso1 : isocodes[lowerLang].iso2 })
        let cardbody = getElement('div', { class: 'card-body' })
        cardbody.innerText = arr.join('\n')
        card.appendChild(cardbody)
        document.querySelector('#mycontainer').appendChild(card)
      }
      count++;
    }



  }

  document.addEventListener("DOMContentLoaded", ready);
