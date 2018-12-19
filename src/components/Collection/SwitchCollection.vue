<template>
  <div class="mb-3">
    <!-- <h2 class="display-2 mt-4 pb-3">Switch Collection</h2> -->

    <card>
      <card-title class="font-weight-regular justify-space-between">
        <span>Current Collection: {{ currentCollection }}</span>
      </card-title>

      <card-text>
       <!-- <v-select
            v-model="currentCollection"
            :items="items"
            attach
            label="Collection"
          ></v-select> -->
          <v-btn
          block
          color="primary"
          @click="save"
        >
          Switch collection to {{alternativeCollection}}
        </v-btn>
      </card-text>

      <!-- <card-actions>

      </card-actions> -->
    </card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import router from '@/router'
import Card from '@/components/Lite/Card'
import CardTitle from '@/components/Lite/Card/Title'
import CardText from '@/components/Lite/Card/Text'

export default {
  name: 'SwitchCollection',
  components: {
    Card,
    CardTitle,
    CardText
  },
  methods: {
    ...mapActions('snackbar', { setSnackbarText: 'setText' }),
    ...mapActions('collection', { getCurrentCollection: 'getCurrent', changeCollection: 'changeCurrent' }),
    ...mapActions('loading', ['setLoaded']),
    save () {
      const switchingTo = this.alternativeCollection.slice(0, this.alternativeCollection.length)
      this.changeCollection()
      this.setSnackbarText(`Switched to ${switchingTo}'s collection`)
      router.push('/home')
    }
  },
  computed: {
    ...mapState('collection', { currentCollection: 'current' }),
    alternativeCollection () {
      return this.currentCollection === 'Jonathan' ? 'Arran' : 'Jonathan'
    }
  },
  async created () {
    await this.getCurrentCollection()
    await this.setLoaded('Collection')
  }
}
</script>
