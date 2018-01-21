<template>
  <div class="movie-poster" @click="showModal()" v-if="option" >
    <img class="img-fluid img-thumbnail md-elevation-2" v-if="film" :src="getFilmPoster" :alt="option.name + ' image'">
    <div v-else class="d-flex flex-column justify-content-center fake-movie-poster md-elevation-2" :style="{backgroundColor: getColor()}">
      <div class="h-30 w-100 align-self-end">
        <p style="font-size: 1.6em;" class="text-white text-center">{{option.name}}</p>
      </div>
    </div>
    <h4 class="md-subheading text-center">
      {{option.name}}
    </h4>
  </div>
</template>

<script>
import utils from '@/utils'
import constants from '@/constants'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'OptionPreview',
  props: ['option'],
  computed: {
    ...mapGetters('films', {getFilm: 'get'}),
    lastWatched: function () {
      if (this.film && this.film.lastWatched) {
        return utils.humanizeTimeToNowImprecise(this.film.lastWatched) + ' ago'
      }
      return null
    },
    getFilmPoster: function () {
      if (this.film && this.film.poster_path) {
        return utils.getTmdbPosterImage(this.film.poster_path)
      }
      return ''
    },
    film () {
      if (this.option.film && this.option.film_id) {
        return this.getFilm(this.option.film_id)
      }
      return null
    }
  },
  methods: {
    ...mapActions('films', {fetchFilm: 'get'}),
    getColor: function () {
      return utils.selectRandom(constants.colors['800'])
    },
    showModal: function () {
      if (this.film) {
        this.$router.push({name: 'Home', params: { filmId: this.film._id }})
      }
    }
  },
  created () {
    if (!this.film) {
      this.fetchFilm(this.option.film_id)
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
</style>
