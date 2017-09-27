import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  timeout: 1000,
  params: {
    api_key: 'ace0d63079205f9ef9e1054736419dd3'
  }
})

const functions = {
  getMovieData: (movieId) => {
    return instance.get('movie/' + movieId)
  }
}

export default functions
