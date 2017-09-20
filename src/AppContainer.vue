<template>
  <div class="" style="height:100vh" id="app">
    <router-view class="h-75"></router-view>
    <statistics-footer class="h-25 pt-3"></statistics-footer>
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
