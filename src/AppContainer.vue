<template>
  <div id="app">
    <router-view></router-view>
    <statistics-footer></statistics-footer>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import StatisticsFooter from '@/components/StatisticsFooter'

export default {
  name: 'app',
  components: {
      StatisticsFooter
  }
}
</script>
