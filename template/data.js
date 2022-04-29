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

      cardElem.setAttribute('id','hadith'+hadith.hadithnumber)
      cardElem.querySelector('a').setAttribute('href','#hadith'+hadith.hadithnumber)

      cardElem.setAttribute('dir',dirval)
      cardElem.setAttribute('lang',isocodes[lowerLang].iso1 ? isocodes[lowerLang].iso1 : isocodes[lowerLang].iso2)

   document.querySelector('#mycontainer').appendChild(cardElem)
  }

}



document.addEventListener("DOMContentLoaded", ready);
window.beginSearch = function () {
  let newparams = new URLSearchParams();
  let searchquery = document.getElementById('searchquery').value
  newparams.set('q', `site:fawazahmed0.github.io/hadiths ${searchquery}`)
  window.open('https://www.google.com/search?' + newparams.toString(), '_blank');
}