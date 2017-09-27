<template>
  <div v-if="storedFilms">
    <template v-for="film in storedFilms">
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
  name: 'OptionsSelector',
  components: {
    OptionPreview
  },
  computed: {
    ...mapGetters('films', {storedFilms: 'list'})
  },
  created() {
    queries.getAllFilms()
  }
}
</script>
