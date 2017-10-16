<template>
  <div>
    <modal :pivotY="0.05" :name="`${film._id}-detail`" height="auto" width="85%" @opened="modalOpened()" :scrollable="true">
      <div class="card" v-if="film.data">
        <img class="card-img-top" :src="backdropImage" :alt="`{film.name} Backdrop`">
        <div class="card-body">
          <h4 class="card-title">{{film.name}} <small>{{getFilmYear(film.release_date)}}</small></h4>
          <p class="text-muted"><span class="font-weight-bold">Runtime</span>: {{film.data.runtime}} mins | <span class="font-weight-bold">Genres</span> {{film.genres.join(', ')}}</p>
          <p class="card-text">{{film.overview}}</p>
        </div>
        <div class="card-body">
          <a v-if="isCurrentPollInNomination" href="#" @click="addNomination()" :class="shouldNominate" class="card-link font-weight-bold">Nominate</a>
          <a v-once :href="getImdbLink" target="_blank" class="card-link">More Information</a>
        </div>
      </div>
      <loading-bounce v-else></loading-bounce>
    </modal>

    <div class="card-group">
      <div class="card" @click="showDetail()">
        <div class="card-body">
          <h4 class="card-title d-inline">{{film.name}} <small>{{getFilmYear()}}</small></h4> 
        </div>
        <div class="card-body">
          <div class="row d-flex">
            <div class="col-2">
              <span class="badge badge-primary">{{film.score}}</span>
            </div>
            <div class="col-7">
              {{film.genres.join(', ')}}
            </div>
            <div class="col-3">
              <button :disabled="!hasNominationsRemaining" class="btn btn-danger btn-sm" @click="addNomination">Nominate</button>
            </div>
          </div>
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
import queries from '@/api'
import utils from '@/utils'
import tmdbApi from '@/api/tmdb'
import {mapGetters} from 'vuex'
import LoadingBounce from '@/components/Loading/LoadingBounce'

  export default {
    props:  ['film'],
    components :{
      LoadingBounce
    },
    methods: {
      showDetail: function() {
         this.$modal.show(`${this.film._id}-detail`);
      },
      hideDetail: function () {
        this.$modal.hide(`${this.film._id}-detail`)
      },
      getFilmYear: function(){
        return utils.getYearFromTmdbReleaseDate(this.film.release_date)
      },
      modalOpened: function () {
        tmdbApi.getMovieData(this.film.tmdb_id)
          .then(response => this.$set(this.film, 'data', response.data))
          .catch(error => {console.error(error); this.hideDetail()})
          
      },
      addNomination: function () {
        queries.addNomination(this.film)
          .then(() => {this.hideDetail(); this.$router.push('/')})
          .catch(error => console.error(error))
      }
    },
    computed: {
      ...mapGetters('option', ['hasNominationsRemaining', 'hasNominationsRemaining']),
      ...mapGetters('poll', ['isCurrentPollInNomination']),
      backdropImage: function () {
        if (this.film.data) {
          return utils.getTmdbBackdropImage(this.film.data.backdrop_path)
        }
        return ''
      },
      getImdbLink: function () {
        return `https://www.imdb.com/title/${this.film.data.imdb_id}`
      },
      shouldNominate: function () {
        return {
          shouldNominate: {'text-muted': !this.hasNominationsRemaining, 'not-active': !this.hasNominationsRemaining}
        }
      }
    }
  }
</script>

<style scoped>
.not-active {
   pointer-events: none;
   cursor: default;
}
</style>
