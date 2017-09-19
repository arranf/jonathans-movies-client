<template>
    <div class="container h-80">
        <div class="d-flex h-100 align-items-stretch">
            <div class="col" v-if="this.polls">
                <select-movie :movies="options" :pollId="this.polls[0].id"></select-movie>
            </div>
            <div class="col">

            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import SelectMovie from '@/components/Home/SelectMovie'

export default {
    name:'Home',
    components: {
        SelectMovie
    },
    data() {
        return {
            colors: ['#c62828', ]
        }
    },
    computed:{
        ...mapGetters('poll', {
            polls: 'list'
        }),
        ...mapGetters('option', {
            options: 'list'
        })
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
        const pollQuery = {
            $sort: {endDateTime: 1},
            $limit: 1,
            startDateTime: {
                $gte: new Date().getTime()
            },
            endDateTime: {
                $lt: new Date().getTime()
            }
        }
        
        this.getPoll({pollQuery})
        .then(this.getOptions({query: {id: this.polls[0].id}}))
        .catch(error => console.error(error))
    }
}
</script>

<style scoped>

</style>
