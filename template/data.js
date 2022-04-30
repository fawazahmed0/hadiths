async function ready() {
  document.querySelector('#mycontainer').insertAdjacentHTML('beforeend', searchBar)
  let params = new URLSearchParams(document.location.search);
  let edition = params.get("edition");
  let bareedition = params.get("bareedition") || edition.replace(/\d+/g, '').split('-')[1].trim()
  let type = params.get("type") || 'section'
  let num = params.get("num");
  let grade = params.get("grade");

  if (!bareedition || (!num && type != 'full'))
    return

  let endpoint
  if (type == 'full')
    endpoint = `editions/${edition}`
  else if (type == 'section')
    endpoint = `editions/${edition}/sections/${num}`
  else if (type == 'single')
    endpoint = `editions/${edition}/${num}`

  let isocodes = await getJSON('isocodes/iso-codes', quranLinks)
  let [editionsJSON, data] = await getJSON(['editions', endpoint])
  let [_, lang, dirval] = editionsJSON[bareedition].collection.filter(e => e.name == edition).map(e => [e.name, e.language, e.direction])[0]

  let hadiths = data.hadiths
  if (grade) {
    grade = grade.trim().toLowerCase()
    hadiths = hadiths.filter(hadith => hadith.grades.some(e => e.grade.toLowerCase().includes(grade)))
  }
  if(type=='section' && isObject(data?.metadata?.section)){ 
   let [numVal,sectionVal] = Object.entries(data.metadata.section).flat()
    document.querySelector('#mycontainer').insertAdjacentHTML('beforeend', `<h2 class="text-center">Section ${numVal}: ${sectionVal}</h2>`)
  }
  hadiths = hadiths.filter(hadith => hadith?.text)
  for (let hadith of hadiths)
    document.querySelector('#mycontainer').appendChild(getHadithCardElem(hadith, edition, dirval, lang, isocodes))



}




document.addEventListener("DOMContentLoaded", ready);
