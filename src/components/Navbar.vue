<template>
  <nav class="navbar sticky-top navbar-expand-sm navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Vote</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <router-link class="nav-link" to="/home">Home</router-link>
            </li>
            <li class="nav-item" v-if="currentUser && currentUser.isAdmin">
                <router-link class="nav-link" to="/admin">Admin</router-link>
            </li>
        </ul>
    </div>
    </nav>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'navbar',
  computed: {
    ...mapGetters('users', {currentUser: 'current'})
  }
}
</script>
