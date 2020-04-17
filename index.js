const API_URL = 'https://cfw-takehome.developers.workers.dev/api/variants'
const URL_COOKIE = 'URL_COOKIE'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}


async function fetchURL (request) {
  let response
  let potential_cookie = getCookie(request, URL_COOKIE)
  if(potential_cookie) {
  	response = await fetch(potential_cookie)
  	return response
  }
  let api_response = await fetch(API_URL)
  let apis = await api_response.json()
  let random_num = Math.floor(Math.random() * 2)
  let url = apis.variants[random_num]
  request = new Request(url, request)
  response = await fetch(request)
  response = new Response(response.body, response)
  response.headers.append('Set-Cookie', `${URL_COOKIE}=${url}`)
  return response
}

async function handleRequest(request) {
	let response = await fetchURL(request)
	let new_response = new HTMLRewriter()
	  .on('title', {
	  	element(e){
	  		e.setInnerContent('CHANGE UR TITLE...')
	  	}
	  })
	  .on('h1#title', {
	  	element(e){
	  		e.setInnerContent('NEW VARIANT...')
	  	}
	  })
	  .on('p#description', {
	  	element(e){
	  		e.setInnerContent('NEW DESCRIPTION...')
	  	}
	  })
	  .on('a#url', {
	  	element(e){
	  		e.setAttribute('href', 'https://www.linkedin.com/in/zheng-yao/')
	  		e.setInnerContent('Jump To ZhengYao\'s LinkedIn')
	  	}
	  })
	  .transform(response)
	  return new_response
}