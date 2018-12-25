<template>
  <list-tile @click.prevent="showModal()">
      <v-list-tile-avatar>
        <avatar color="primary" :size="40">
          <span class="white--text headline">{{filmStart}}</span>
        </avatar>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title v-text="film.name"></v-list-tile-title>
        <v-list-tile-sub-title v-html="film.releaseYear"></v-list-tile-sub-title>
      </v-list-tile-content>
  </list-tile>
</template>

<script>
// TODO: Refactor into functional component
import Avatar from '@/components/Lite/Avatar'
import ListTile from '@/components/Lite/List/Tile'

export default {
  name: 'FilmListItem',
  props: {
    film: { type: Object }
  },
  components: {
    Avatar,
    ListTile
  },
  methods: {
    showModal: function () {
      this.$router.push({ name: 'Movies', params: { filmId: this.film._id } })
    }
  },
  computed: {
    filmStart: function () {
      const code = this.film.name.charCodeAt(0)
      if (
        // !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)
      ) {
        // lower alpha (a-z)
        return '#'
      }
      return this.film.name[0]
    }
  }
}
</script>
