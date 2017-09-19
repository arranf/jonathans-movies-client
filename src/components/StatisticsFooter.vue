<template>
    <footer>
        <div class="container-fluid" v-if="user">
            <div class="row">
                <div class="col">
                    <div class="card-deck">
                        <div class="card">
                            <div class="card-body">
                                <p class="card-text" v-if="polls"><strong>{{polls.length}}</strong> Polls Made</p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <p class="card-text" v-if="votes"><strong>{{votes.length}}</strong> Votes Cast</p>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-body">
                                <p class="card-text"><strong>1</strong> <a target="_blank" href="http://www.imdb.com/title/tt3508840/" class="card-link">The Assassin</a></p>
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
import {mapGetters, mapState, mapActions} from 'vuex'

export default {
  name: 'StatisticsFooter',
  data() {
      return {
          gotVoteandPolls: false
      }
  },
  computed: {
      ...mapGetters('vote', {votes: 'list'}),
      ...mapGetters('poll', {polls: 'list'}),
      ...mapState('auth', ['user'])
  },
  methods: {
      ...mapActions('vote', {getVotes: 'find'}),
      ...mapActions('poll', {getPolls: 'find'}),
  },
  beforeUpdate: function() {
      if (this.user && !this.gotVoteandPolls){
        this.getPolls({query:{}})
        .then(this.getVotes({query: {}}))
        .then(this.gotVoteandPolls = true)
      }
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
