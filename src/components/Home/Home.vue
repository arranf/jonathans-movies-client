<template>
    <div class="container h-100">
        <div class="row d-flex h-75 align-items-stretch">
            <div class="col" v-if="isActivePoll">
                <select-movie :movies="options" :pollId="this.pollId"></select-movie>
            </div>
        </div>
        <div class="row h-25">
            <div class="col">
                
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import queries from '@/api'
import SelectMovie from '@/components/Home/SelectMovie'


export default {
    name:'Home',
    components: {
        SelectMovie
    },
    data() {
        return {
            pollId: null
        }
    },
    computed:{
        ...mapGetters('poll', {
            polls: 'list'
        }),
        ...mapGetters('option', {
            options: 'list'
        }),
        ...mapGetters('poll', ['getActivePoll', 'isActivePoll'])
    },
    methods: {
        ...mapActions('poll', {
            getPoll: 'find'
        }),
        ...mapActions('option', {
            getOptions: 'find'
        })
    },
    created: function () {
        queries.getCurrentPoll()
        .then(response => {
            if (response.total > 0){
                this.pollId = response.data[0]._id
                return this.getOptions({query: {poll_id: this.pollId}})
            } else {
                return Promise.resolve()
            }
        })
        .catch(error => console.error(error))
    }
}
</script>

<style scoped>

</style>
