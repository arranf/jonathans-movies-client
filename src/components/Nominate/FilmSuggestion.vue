<template>
  <div class="card">
    <div class="card-body">
      {{film.name}}
    </div>
  </div>  
</template>

<script>
  export default {
    props:  ['film']    
  }
</script>