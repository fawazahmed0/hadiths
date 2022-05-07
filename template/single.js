async function ready() {
  let params = new URLSearchParams(document.location.search);
  let edition = params.get("edition")
  let bareedition = params.get("bareedition") || edition.replace(/\d+/g, '').split('-')[1].trim()
  if (!bareedition)
    return

  showSpinningWheel('#mycontainer','beforeend')
  let data = await getJSON('info')


  let UL = getElement('ul', { class: 'list-group' })
  for (let i = 0; i <= data[bareedition].metadata.last_hadithnumber + 50; i++) {
    let LI = getElement('li', { class: 'list-group-item' })
    let newparams = new URLSearchParams();
    newparams.set('bareedition', bareedition)
    newparams.set('num', i)
    let aElem = getElement('a', { href: `dataseo.html?${newparams.toString()}` })
    aElem.innerText = `Hadith Number  ${i}`
    LI.appendChild(aElem)
    UL.appendChild(LI)
  }
  removeSpinningWheel()
  document.querySelector('#mycontainer').appendChild(UL)
}




document.addEventListener("DOMContentLoaded", ready);