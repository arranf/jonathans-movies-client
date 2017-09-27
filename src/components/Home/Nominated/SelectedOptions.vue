<template>
  <div>
    <div class="p-2 card h-10">
    <div class="card-body">
      <h4 class="card-title">Why Not Nominate A Movie?</h4>
      <router-link to="/nominate" class="btn btn-primary">Suggest Your Favourite</router-link>
    </div>
  </div>
    <template v-if="getNominatedFilms.length > 0" v-for="film in getNominatedFilms">
      <option-preview class="p-2" :key="film._id" :film="film">
    </option-preview>
    </template>
  </div>
</template>

<script>
import OptionPreview from './OptionPreview'
import queries from '@/api'
import {mapGetters} from 'vuex'

export default {
  name: 'SelectedOptions',
  components: {
    OptionPreview
  },
  computed: {
    ...mapGetters('films', ['getNominatedFilms'])
  },
  created() {
    queries.getAllFilms()
  }
}
</script>
