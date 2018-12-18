import Vue from 'vue'
import Vuex from 'vuex'

import feathersClient from '../api/feathers-client'
import feathersVuex from 'feathers-vuex'

// import usersOnlineGetters from './users-online/getters'
import voteGetters from './vote/getters'
import optionGetters from './option/getters'
import pollGetters from './poll/getters'

import time from '@/store/time'
import snackbar from '@/store/snackbar'
import collection from '@/store/collection'
import loading from '@/store/loading'

const { service, auth, FeathersVuex } = feathersVuex(feathersClient, {
  idField: '_id'
})
Vue.use(FeathersVuex)
Vue.use(Vuex)

let plugins = [
  service('poll', {
    getters: pollGetters,
    instanceDefaults: {
      options: 'Option'
    }
  }),
  service('option', {
    getters: optionGetters,
    instanceDefaults: {
      film: 'Film'
    }
  }),
  service('vote', { getters: voteGetters }),
  service('users'),
  service('films', {
    instanceDefaults: {
      get imdbLink () {
        return this.imdb_id ? `https://www.imdb.com/title/${this.imdb_id}` : ''
      },
      get posterSvgPlaceholder () {
        return this.poster_svg_base64encoded
          ? `data:image/svg+xml;base64,${this.poster_svg_base64encoded}`
          : this.tmdbPosterImage
      },
      get tmdbPosterImage () {
        return this.poster_path ? `https://image.tmdb.org/t/p/w342/${this.poster_path}` : ''
      },
      get tmdbPosterSrcSet () {
        const slug = this.poster_path
        return slug ? `https://image.tmdb.org/t/p/w154${slug} 154w,https://image.tmdb.org/t/p/w185${slug} 185w,https://image.tmdb.org/t/p/w342${slug} 342w,https://image.tmdb.org/t/p/w500${slug} 500w`
          : ''
      },
      get backdropSvgPlaceholder () {
        return this.backdrop_svg_base64encoded
          ? `data:image/svg+xml;base64,${this.backdrop_svg_base64encoded}`
          : this.tmdbBackDropImage
      },
      get tmdbBackDropImage () {
        return this.backdrop_path ? `https://image.tmdb.org/t/p/w1280${this.backdrop_path}` : ''
      },
      get tmdbBackdropSrcSet () {
        const slug = this.backdrop_path
        return slug ? `https://image.tmdb.org/t/p/w780${slug} 780w,https://image.tmdb.org/t/p/w1280${slug} 1280w` : ''
      },
      get releaseYear () {
        return this.release_date ? new Date(this.release_date).getFullYear() : ''
      }
    }
  }),
  // service('users-online', { getters: usersOnlineGetters }),
  auth({ userService: 'users' })
]

const store = new Vuex.Store({
  modules: {
    time,
    snackbar,
    collection,
    loading
  },
  plugins: [...plugins]
})

export default store
