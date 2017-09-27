<template>
  <option-preview :film="film"></option-preview>
</template>

<script>
import OptionPreview from '@/components/Nominate/OptionPreview'

export default {
  name: 'Nominate',
  components: {
    OptionPreview
  },
  data() {
    return {
      film: {
        _id: "someId",
        name: "Hercules",
        tmdbId: "11970",
        lastWatched: 1506280871000
      }
    }
  }
}
</script>
