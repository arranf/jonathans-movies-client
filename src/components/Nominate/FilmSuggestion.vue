<template>
  <div>
    <modal :name="film._id + '-detail'" height="auto" width="90%" @opened="modalOpened()" :scrollable="true">
      hello, world!
    </modal>

    <div class="card-group">
      <div class="card" @click="showDetail()">
        <div class="card-body">
          <h4 class="card-title d-inline">{{film.name}} <small>({{new Date(film.release_date).getFullYear()}})</small></h4> 
        </div>
        <div class="card-body">
          <div class="row d-flex">
            <div class="col-2">
              <span class="badge badge-primary">{{film.score}}</span>
            </div>
            <div class="col-7">
              {{film.genres.join(', ')}}
            </div>
            <div class="col-3">
              <button class="btn btn-danger btn-sm">Choose</button>
            </div>
          </div>
        </div>
      </div>  
    </div>
  </div>
</template>

<script>

  export default {
    props:  ['film'],
    methods: {
      showDetail: function() {
         this.$modal.show(this.film._id + '-detail');
      },
      modalOpened: function () {
        
      }
    }
  }
</script>