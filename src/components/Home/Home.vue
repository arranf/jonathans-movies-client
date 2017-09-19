<template>
    <div class="container">
        <div class="row">
            <div class="col">
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
            polls: 'list'
        }),
    },
    methods: {
        ...mapActions('poll', {
            getPoll: 'find'
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
    }
}
</script>
