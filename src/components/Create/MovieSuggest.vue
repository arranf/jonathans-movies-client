<template>
  <div>
    <input type="text" @input="" name="movies" class="form-control">
    <div class="autocomplete-suggestions">
    <div class="autocomplete-group"><strong>NHL</strong></div>
    <div class="autocomplete-suggestion autocomplete-selected">...</div>
    <div class="autocomplete-suggestion">...</div>
    <div class="autocomplete-suggestion">...</div>
</div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style scoped>
  .autocomplete-suggestions { border: 1px solid #999; background: #fff; cursor: default; overflow: auto; }
  .autocomplete-suggestion { padding: 10px 5px; font-size: 1.2em; white-space: nowrap; overflow: hidden; }
  .autocomplete-selected { background: #f0f0f0; }
  .autocomplete-suggestions strong { font-weight: normal; color: #3399ff; }
</style>

