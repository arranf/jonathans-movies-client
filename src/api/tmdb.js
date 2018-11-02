const baseURL = 'https://api.themoviedb.org/3/'

function makeRequest (opts) {
  return new Promise(function (resolve, reject) {
    let queryParameters = ''
    if (opts.method === 'GET') {
      let params = opts.params
      // We'll need to stringify if we've been given an object
      // If we have a string, this is skipped.
      if (params && typeof params === 'object') {
        queryParameters =
          '?' +
          Object.keys(params)
            .map(function (key) {
              return (
                encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
              )
            })
            .join('&')
      }
    }
    var xhr = new XMLHttpRequest()
    xhr.open(opts.method, opts.url + queryParameters)
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response))
      } else {
        reject(
          new Error(
            'unable to complete ' + opts.method + ' request for: ' + opts.url
          )
        )
      }
    }
    xhr.onerror = function () {
      reject(
        new Error(
          'unable to complete ' + opts.method + ' request for: ' + opts.url
        )
      )
    }
    if (opts.headers) {
      Object.keys(opts.headers).forEach(function (key) {
        xhr.setRequestHeader(key, opts.headers[key])
      })
    }
    let params = opts.params
    // We'll need to stringify if we've been given an object
    // If we have a string, this is skipped.
    if (params && typeof params === 'object') {
      queryParameters = Object.keys(params)
        .map(function (key) {
          return (
            encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
          )
        })
        .join('&')
    }
    xhr.send(params)
  })
}

const functions = {
  getMovieData: movieId => {
    return makeRequest({
      method: 'GET',
      url: baseURL + 'movie/' + movieId,
      params: { api_key: 'ace0d63079205f9ef9e1054736419dd3' }
    })
  },
  searchForMovie: movieName => {
    return makeRequest({
      method: 'GET',
      url: baseURL + 'search/movie',
      params: { api_key: 'ace0d63079205f9ef9e1054736419dd3', query: movieName }
    })
  }
}

export default functions
