function getElement(elementName, attributesObj){
    let element = document.createElement(elementName);
    for(let [key,value] of Object.entries(attributesObj)){
        element.setAttribute(key, value);
    }
    return element
  }

  let apiLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/","https://gitcdn.link/cdn/fawazahmed0/hadith-api/1/","https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/"]
  let quranLinks = ["https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/","https://gitcdn.link/cdn/fawazahmed0/quran-api/1/","https://raw.githubusercontent.com/fawazahmed0/quran-api/1/"]
  let extensions = [".min.json",".json"]

  // https://www.shawntabrizi.com/code/programmatically-fetch-multiple-apis-parallel-using-async-await-javascript/
// Get links async i.e in parallel
async function getJSON (endpoints,links) {
    if(!Array.isArray(endpoints))
    endpoints = [endpoints]
    return await Promise.all(
      endpoints.map(endpoint => fetchWithFallback(getURLs(endpoint,links)).then(response => response.json()))
    ).catch(console.error)
  }
  

  async function fetchWithFallback(links,obj){
    let response;
    for(let link of links)
    {  try{
        response = await fetch(link,obj)
        if(response.ok)
            return response
          }catch(e){}
    }
     return response
  }
  
  // convert endpoint into multiple urls, including fallback urls
  function getURLs(endpoint, links){
      links = links || apiLinks
    return extensions.map(ext=>links.map(e=>e+endpoint+ext)).flat()
  }