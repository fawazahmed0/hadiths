async function ready() {
  let params = new URLSearchParams(document.location.search);
  let edition = params.get("edition");
  let bareedition = params.get("bareedition") || edition.replace(/\d+/g, '').split('-')[1].trim()
  let type = params.get("type") || 'section'
  let num = params.get("num");
  let grade = params.get("grade");

  if(!bareedition || !num)
    return

  let endpoint
  if (type == 'full')
  endpoint = `editions/${edition}`
  else if (type = 'section')
  endpoint = `editions/${edition}/sections/${num}`
  else if (type = 'single')
  endpoint = `editions/${edition}/${num}`

  let isocodes = await getJSON('isocodes/iso-codes', quranLinks)
  let [editionsJSON ,data]= await getJSON(['editions',endpoint])
  let [_, lang, dirval] = editionsJSON[bareedition].collection.filter(e => e.name == edition).map(e => [e.name, e.language, e.direction])[0]
  let lowerLang = lang.toLowerCase()
  let hadiths = data.hadiths
  if (grade) {
    grade = grade.trim().toLowerCase()
    hadiths = hadiths.filter(hadith => hadith.grades.some(e => e.grade.toLowerCase().includes(grade)))
  }
  hadiths = hadiths.filter(hadith => hadith?.text)
  for (let hadith of hadiths) {

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

}



document.addEventListener("DOMContentLoaded", ready);
window.beginSearch = function () {
  let newparams = new URLSearchParams();
  let searchquery = document.getElementById('searchquery').value
  newparams.set('q', `site:fawazahmed0.github.io/hadiths ${searchquery}`)
  window.open('https://www.google.com/search?' + newparams.toString(), '_blank');
}