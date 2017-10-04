<template>
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
</template>

<script>
import {mapGetters, mapState, mapActions} from 'vuex'
import queries from '@/api' 

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
  // TODO Remove these and use api queries
  methods: {
      ...mapActions('vote', {getVotes: 'find'}),
      ...mapActions('poll', {getPolls: 'find'}),
  },
  beforeUpdate: function() {
      if (this.user && !this.gotVoteandPolls){
        queries.getCurrentPoll()
        .then(this.getVotes({query: {$limit: 100}}))
        .then(this.gotVoteandPolls = true)
      }
  }
}
</script>