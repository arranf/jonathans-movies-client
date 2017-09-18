<template>
    <div class="container">
        <div class="row">
            <div class="col">
                Home
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    name:'Home',
    computed:{
        ...mapGetters('poll', {
            poll: 'list'
        }),
    },
    methods: {
        ...mapActions('poll', {
            findPoll: 'find'
        })
    },
    created: function () {
        const query = {
            $sort: {endDateTime: 1},
            $limit: 1,
            startDateTime: {
                $gte: new Date().getTime()
            },
            endDateTime: {
                $lt: new Date().getTime()
            }
        }
        console.log(this.findPoll({query}))
    }
}
</script>
