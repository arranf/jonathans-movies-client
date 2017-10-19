<template>
  <div>
    <movie-info-modal :film="film" :show-nominate="true"></movie-info-modal>

    <div class="card-group">
      <div class="card" @click="showModal()">
        <div class="card-body">
          <h4 class="card-title d-inline">{{film.name}} <small>{{getFilmYear}}</small></h4> 
        </div>
        <div class="card-body">
          <div class="row d-flex">
            <div class="col-2">
              <span class="badge badge-primary">{{film.score}}</span>
            </div>
            <div class="col-6">
              {{film.genres.join(', ')}}
            </div>
            <div class="col-4">
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
import {mapGetters} from 'vuex'

import MovieInfoModal from '@/components/MovieInfoModal'

  export default {
    props:  ['film'],
    components: {
      MovieInfoModal
    },
    methods: {
      showModal: function() {
         utils.showModal(this, this.film._id)
      },
      hideModal: function () {
        utils.hideModal(this, this.film._id)
      },
      addNomination: function () {
        queries.addNomination(this.film)
          .then(() => {this.hideModal(); this.$router.push('/')})
          .catch(error => console.error(error))
      }
    },
    computed: {
      ...mapGetters('option', ['hasNominationsRemaining']),
      getFilmYear: function(){
        if (this.film && this.film.release_date) {
          return utils.getYearFromTmdbReleaseDate(this.film.release_date)
        }
      },
      shouldNominate: function () {
        return {
          shouldNominate: {'text-muted': !this.hasNominationsRemaining, 'not-active': !this.hasNominationsRemaining}
        }
      }
    }
  }
</script>