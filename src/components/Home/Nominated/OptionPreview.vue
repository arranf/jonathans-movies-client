<template>
<div>
  <movie-info-modal v-if="option.film" :film="option.film" :show-nominate="false"></movie-info-modal>

    <div class="mt-2 mb-1 movie-poster" @click="showModal()" v-if="option" >
      <img class="img-fluid img-thumbnail" v-if="option.film && option.film.data" v-once :src="getFilmPoster" :alt="option.name + ' image'">
      <div v-else class="d-flex fake-movie-poster" :style="{backgroundColor: getColor()}">
        <div class="h-30 w-100 align-self-end">
          <p style="font-size: 1.6em;" class="text-white text-center">{{option.name}}</p>
        </div>
      </div>
      <h6 class="mt-1 text-muted ml-3">
        {{option.name}}
      </h6>
    </div>
</div>
</template>

<script>
import utils from '@/utils'
import constants from '@/constants'
import {mapState, mapActions} from 'vuex'
import MovieInfoModal from '@/components/MovieInfoModal'

export default {
  name: 'OptionPreview',
  props: ['option'],
  components: {
    MovieInfoModal
  },
  computed: {
    ...mapState('option', {waitingForOptionFind: 'isFindPending'}),
    lastWatched: function () {
      if (this.option.film && this.option.film.lastWatched){
        return utils.humanizeTimeToNowImprecise(this.option.film.lastWatched) + ' ago'
      }
      return null
    },
    getFilmBackdrop: function () {
      if (this.option.film && this.option.film.data && this.option.film.backdrop_path) {
        return utils.getTmdbBackdropImage(this.option.film.data.backdrop_path)
      }
      return null
    },
    getFilmPoster: function () {
      if (this.option.film && this.option.film.data) {
        return utils.getTmdbPosterImage(this.option.film.data.poster_path)
      }
      return null
    },
    getImdbLink: function () {
      if (this.option.film && this.option.film.data && this.option.film.data.imdb_id) {
        return `https://www.imdb.com/title/${this.option.film.data.imdb_id}`
      }
    },
    getFilmYear: function() {
      if (this.option.film && this.option.film.release_date) {
        return utils.getYearFromTmdbReleaseDate(this.option.film.release_date)
      }
      return null
    }
  },
  methods: {
    ...mapActions('option', ['getFilmData']),
    getColor: function () {
      return utils.selectRandom(constants.colors['800'])
    },
    showModal: function() {
      utils.showModal(this, this.option.film._id)
    }
  },
  data () {
    return {
      fetchedData: false
    }
  },
  created() {
    if (this.option.film ) {
      this.getFilmData(this.option)
    }
  }
}
</script>

<style>
.movie-poster {
  width: 11.5rem;
  margin-right: 0.5em; margin-left: 0.5em;
}

.fake-movie-poster {
  height: 17rem;
}

@media (min-height: 500px) {
	.movie-poster {
      width: 12rem;
    }
  
  .fake-movie-poster {
    height: 17.5rem; 
  }
}

@media (min-height: 550px) {
	.movie-poster {
      width: 12.3rem;
    }
  
  .fake-movie-poster {
    height: 18rem; 
  }
}

@media (min-height: 600px) {
	.movie-poster {
      width: 15rem;
    }
  
  .fake-movie-poster {
    height: 22rem; 
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

@media (min-height: 700px) {
	.movie-poster {
      width: 21rem;
    }
  
  .fake-movie-poster {
    height: 31rem;
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
