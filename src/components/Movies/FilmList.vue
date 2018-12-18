<template>
   <div>
      <div v-if="allFilms">
        <!-- TODO: Move this out and make it emit update events and a filter event -->
        <v-dialog lazy v-model="showFilters">
          <v-card>
            <v-card-title class="headline">Filter Movies</v-card-title>

            <v-subheader>Genres</v-subheader>
            <v-card-text class="pt-0 pb-0">
              <v-select :items="totalGenres" v-model="genres" multiple chips deletable-chips item-text="name" item-value="name" />
            </v-card-text>
            <v-subheader>Minimum Rating</v-subheader>
            <v-card-text class="pt-0 pb-0">
              <v-slider v-model="floorRating" thumb-label min="0" max="10" step="0.5" ticks></v-slider>
            </v-card-text>
            <v-card-actions>
              <spacer id="hide" />
              <v-btn flat @click.prevent="requery()" type="submit" class="md-accent md-raised">Submit</v-btn>
              <v-btn flat @click.prevent="reset()" type="reset">Reset</v-btn>
              <v-btn flat @click.prevent="showFilters = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <movie-info-modal close-route="/movies" :show.sync="showingFilm" :filmId="filmId" :show-nominate="true" />

        <v-list>
          <template v-for="(film, index) in allFilms">
            <film-list-item class="pt-2 pb-2" :film="film" :key="film._id+'item'"/>
            <v-divider v-if="index + 1 < allFilms.length" :key="index"></v-divider>
          </template>
        </v-list>
        <div class="text-center">
          <quote v-if="reachedEnd" />
        </div>
        <progress-linear v-if="loading && isDelayElapsed" :indeterminate="true" />
      </div>

      <v-btn class="big-bottom" right color="accent" fab fixed @click="showFilters = true">
        <icon v-once>filter_list</icon>
      </v-btn>
   </div>
</template>

<script>
import FilmListItem from './FilmListItem'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import debounce from 'tiny-debounce'
import constants from '@/constants'
import scrollListener from '@/scroll-listener'
import Spacer from '@/components/Lite/Spacer'
import Icon from '@/components/Lite/Icon'
import Loading from '@/components/common/Loading'

const MovieInfoModal = () => ({ component: import('@/components/common/MovieInfoModal'), delay: 200, loading: Loading })
const Quote = () => import('@/components/Discover/Quote')
const ProgressLinear = () => import('@/components/common/ProgressLinear')

export default {
  name: 'FilmList',
  components: {
    FilmListItem,
    MovieInfoModal,
    Quote,
    ProgressLinear,
    Spacer,
    Icon
  },
  data: function () {
    return {
      showingFilm: false,
      showFilters: false,
      page: 0,
      limit: 50,
      loadedAll: false,
      loading: false,
      isDelayElapsed: false,
      total: 51,
      sort: { name: 1 },
      floorRating: 0.0,
      genres: [],
      reachedEnd: false
    }
  },
  props: {
    filmId: String
  },
  watch: {
    filmId (newFilmId, oldFilmId) {
      this.showingFilm = Boolean(newFilmId)
    }
  },
  computed: {
    ...mapGetters('films', { allFilms: 'list' }),
    totalGenres: () => constants.genres,
    query: function () {
      let query = {
        query: {
          $limit: this.limit,
          $sort: this.sort,
          $skip: this.limit * this.page
        }
      }
      if (this.genres.length > 0) {
        query.query['genres'] = this.genres
      }
      if (this.floorRating > 0) {
        query.query['imdb_rating'] = { $gte: this.floorRating }
      }
      return query
    }
  },
  methods: {
    ...mapActions('films', { queryFilms: 'find' }),
    ...mapMutations('films', { clearFilms: 'clearAll' }),
    ...mapActions('snackbar', { setSnackbar: 'setText' }),
    ...mapActions('loading', ['setLoaded']),
    reset: function () {
      this.page = 0
      this.genres = ''
      this.total = 51
      this.floorRating = 0
      this.showFilters = false
      this.clearFilms()
      this.getFilms()
    },
    requery: function () {
      this.showFilters = false
      this.page = 0
      this.clearFilms()
      this.getFilms()
    },
    getFilms: function () {
      let query = this.query
      return this.queryFilms(query)
        .then(response => {
          this.total = response.total
          this.loading = false
        })
        .catch(error => {
          console.error(error)
          this.loading = false
          this.setSnackbar('No films can be displayed')
        })
    },
    tryFetchNextPage: function () {
      const offset = this.limit * this.page
      if (offset >= this.total) {
        this.reachedEnd = true
        return
      }
      this.loading = true
      return this.fetchNextPage()
    },
    fetchNextPage: debounce(
      function () {
        this.isDelayElapsed = false
        setTimeout(() => {
          this.isDelayElapsed = true
        }, 200)
        this.page++
        return this.getFilms()
      },
      800
    )
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.listener)
  },
  async created () {
    // $route watcher will not be called when componenet loaded
    this.showingFilm = Boolean(this.filmId)

    // Setup listener
    let nextPage = this.tryFetchNextPage
    this.listener = scrollListener(nextPage)

    this.clearFilms()
    try {
      await this.getFilms()
      document.addEventListener('scroll', this.listener)
      await this.setLoaded('Movies')
    } catch (e) {
      console.error(e)
      document.removeEventListener('scroll', this.listener)
    }
  }
}
</script>

<style scoped>
/* hide the space in modal on small screens */
@media (max-width: 350px) {
  #hide {
    display: none;
  }
}
.big-bottom {
  bottom: 64px;
}
</style>
