<template>
  <div >
    <div class="p-2 card h-10 mt-3">
      <div class="card-body">
        <h4 class="card-title">Why Not Nominate A Movie?</h4>
        <router-link to="/nominate" class="btn btn-primary">Suggest Your Favourite</router-link>
      </div>
    </div>
    <template v-if="getOptionsForCurrentPoll" v-for="option in getOptionsForCurrentPoll">
      <option-preview :key="option._id" :option="option">
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
    ...mapGetters('option', ['getOptionsForCurrentPoll'])
  }
}
</script>
