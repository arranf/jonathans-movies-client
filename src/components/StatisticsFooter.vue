<template>
    <footer>
        <div class="container-fluid" v-if="user">
            <div class="row">
                <div class="col">
                    <div class="card-deck">
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text" v-if="getPolls"><strong>{{getPolls.length}}</strong> Polls Made</p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <p class="card-text" v-if="getVotes"><strong>{{getVotes.length}}</strong> Votes Cast</p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <p class="card-text"><strong>1</strong> <a href="http://www.imdb.com/title/tt3508840/" class="card-link">The Assassin</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col mt-4">
                <p>Made with <i class="fa fa-heart heart" aria-hidden="true"></i> <span class="sr-only">love</span> (and a lot of food from Spar) by Arran and Joel.</p>
            </div>
        </div>
    </footer>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'StatisticsFooter',
  computed: {
      ...mapGetters('vote', {getVotes: 'list'}),
      ...mapGetters('poll', {getPolls: 'list'}),
      ...mapState('auth', ['user'])
  }
}
</script>

<style scoped>
footer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background-color: #efefef;
  text-align: center;
}

.heart {
    color: red;
}
</style>
