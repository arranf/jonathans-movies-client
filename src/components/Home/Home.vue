<template>
  <div id="home-container">
    <movie-info-modal
      :show.sync="showingFilm"
      close-route="/home"
      :film-id="filmId"
      :show-nominate="false"
    />
    <div>
      <selected-options v-if="getActivePoll" />
      <results v-else></results>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Results from "@/components/Home/Results/Results";
import SelectedOptions from "./Nominated/SelectedOptions";
import MovieInfoModal from "@/components/common/MovieInfoModal";

export default {
  name: "Home",
  components: {
    Results,
    SelectedOptions,
    MovieInfoModal,
  },
  props: {
    filmId: String,
  },
  data() {
    return {
      showingFilm: false,
    };
  },
  computed: {
    ...mapGetters("poll", ["getActivePoll"]),
  },
  watch: {
    filmId(newFilmId, oldFilmId) {
      this.showingFilm = Boolean(newFilmId);
    },
  },
  created() {
    this.showingFilm = Boolean(this.filmId);
  },
};
</script>
