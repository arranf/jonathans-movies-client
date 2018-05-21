<template>
  <div @click="showModal()" class="d-flex flex-column align-items-center h-100" v-if="film" >
    <img v-if="film.poster_path" class="img-fluid lazyload" :src="getFilmPoster" :srcset="getFilmLQPosterSrcSet" :data-srcset="getFilmPosterSrcSet" :data-sizes="getFilmPosterSizes" :alt="film.name + ' image'">
    <div v-if="!film.poster_path" class="h-90" :style="{backgroundColor: getColor()}"></div>
    <h4 class="text-center">
      {{film.name}}
    </h4>
  </div>
</template>

<script>
// eslint-disable-next-line
import lazySizes from 'lazysizes'
import utils from '@/utils'
import constants from '@/constants'
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'FilmPreview',
  props: {
    film: {required: true, type: Object},
    modalPageName: {required: true, type: String},
  },
  computed: {
    ...mapState('option', {waitingForOptionFind: 'isFindPending'}),
    ...mapGetters('films', {getFilm: 'get'}),
    getFilmBackdrop: function () {
      if (this.film && this.film.backdrop_path) {
        return utils.getTmdbBackdropImage(this.film.backdrop_path)
      }
      return null
    },
    getFilmPosterSizes: function () {
      return utils.tmdbPosterSizes
    },
    getFilmPosterSrcSet: function () {
      if (this.film && this.film.poster_path) {
        return utils.getTmdbPosterSrcSet(this.film.poster_path)
      }
      return ''
    },
    getFilmLQPosterSrcSet: function () {
      if (this.film && this.film.poster_path) {
        return utils.getTmdbLQPosterSrcSet(this.film.poster_path)
      }
      return ''
    },
    getFilmPoster: function () {
      if (this.film && this.film.poster_path) {
        return utils.getLQPosterImage(this.film.poster_path)
      }
      return ''
    },
    getImdbLink: function () {
      if (this.film && this.film.imdb_id) {
        return `https://www.imdb.com/title/${this.film.data.imdb_id}`
      }
    },
    getFilmYear: function () {
      if (this.film && this.film.release_date) {
        return utils.getYearFromTmdbReleaseDate(this.film.release_date)
      }
      return null
    }
  },
  methods: {
    showModal: function () {
      if (this.film) {
        this.$router.push({name: this.modalPageName, params: { filmId: this.film._id }})
      }
    },
    getColor: function () {
      return utils.selectRandom(constants.colors['800'])
    }
  }
}
</script>

<style>
/* iPhone 4 */
.movie-poster {
  width: 11rem;
  margin-right: 0.5em; margin-left: 0.5em;
}

.fake-movie-poster {
  height: 16rem;
}

@media (min-height: 500px) {
	.movie-poster {
      width: 12rem;
    }
  
  .fake-movie-poster {
    height: 17.5rem; 
  }
}

/* iPhone 5 */
@media (min-height: 550px) {
	.movie-poster {
      width: 11.5rem;
    }
  
  .fake-movie-poster {
    height: 16.8rem; 
  }
}

/* S5 */
@media (min-height: 600px) {
	.movie-poster {
      width: 14rem;
    }
  
  .fake-movie-poster {
    height: 20.5rem; 
  }
}

/* iPhone6 */
@media (min-height: 650px) {
	.movie-poster {
      width: 16rem;
    }
  
  .fake-movie-poster {
    height: 23.5rem;
  }
}

/* Nexus 6 + iPhone 6 Plus*/
@media (min-height: 700px) {
	.movie-poster {
      width: 18rem;
    }
  
  .fake-movie-poster {
    height: 26.5rem;
  }
}

/* iPad Portrait */
@media (min-height: 1000px) {
	.movie-poster {
      width: 24rem;
    }
  
  .fake-movie-poster {
    height: 32.5rem;
  }
}

.blur-up {
		-webkit-filter: blur(5px);
		filter: blur(5px);
		transition: filter 400ms, -webkit-filter 400ms;
	}

	.blur-up.lazyloaded {
		-webkit-filter: blur(0);
		filter: blur(0);
	}
</style>
