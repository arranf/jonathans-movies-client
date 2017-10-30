<template>
  <div class="d-flex flex-column" style="height:100vh" id="app">
    <progress-indicator />
    <router-view class="content m-h-50"></router-view>
    <div class="footer w-100">
      <info-footer class="h-100"></info-footer>
    </div>
  </div>
</template>

<script>
import InfoFooter from '@/components/InfoFooter'
import ProgressIndicator from '@/components/Progress.vue'

export default {
  name: 'app',
  components: {
    InfoFooter,
    ProgressIndicator
  }
}
</script>

<style scoped>
.footer {
  flex-shrink: 0;
}

.content {
  flex: 1 0 auto;
}

.m-h-60 {
  min-height: 60%;
}
</style>

