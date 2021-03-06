<template>
  <div v-if="film" class="h-100 poster" @click="action()">
    <img
      v-if="film.poster_path"
      class="img-fluid lazyload"
      :src="getFilmPoster"
      :data-srcset="getFilmPosterSrcSet"
      :alt="film.name + ' image'"
    />
    <img
      v-else-if="film.justwatch_poster_path"
      class="img-fluid lazyload"
      :src="getJustWatchFilmPoster"
      :data-srcset="getJustWatchFilmPosterSrcSet"
      :alt="film.name + ' image'"
    />
    <img v-else class="img-fluid" :src="getFallbackPoster()" />
    <h4 class="text-center">{{ film.name }}</h4>
    <p
      v-if="reasons.length > 0"
      class="text-center ml-1 mr-1 mt-1 text-smaller"
    >
      Because you liked {{ reasonsSentence }}
    </p>
  </div>
</template>

<script>
// eslint-disable-next-line
import lazySizes from "lazysizes";
import { getTmdbPosterSrcSet, getTmdbPosterImage, selectRandom } from "@/utils";
import { mapGetters } from "vuex";

export default {
  name: "FilmPreview",
  props: {
    film: { required: true, type: Object },
    modalPageName: { required: true, type: String },
    reasons: { type: Array, required: false, default: () => [] },
  },
  computed: {
    ...mapGetters("films", { getFilm: "get" }),
    getFilmPosterSrcSet: function () {
      if (this.film.poster_path) {
        return getTmdbPosterSrcSet(this.film.poster_path);
      }
      return "";
    },
    getJustWatchFilmPosterSrcSet: function () {
      if (this.film.justwatch_poster_path) {
        const slug = this.film.justwatch_poster_path;
        return `https://images.justwatch.com${slug.replace(
          "{profile}",
          "s166"
        )}, https://images.justwatch.com${slug.replace(
          "{profile}",
          "s332"
        )} 2x`;
      }
      return "";
    },
    getFilmPoster: function () {
      if (this.film.poster_svg_base64encoded) {
        return `data:image/svg+xml;base64,${this.film.poster_svg_base64encoded}`;
      }
      return getTmdbPosterImage(this.film.poster_path);
    },
    getJustWatchFilmPoster: function () {
      if (this.film.poster_blur_hash) {
        return `data:image/svg+xml;base64,justwatch_poster_blur_hash`;
      }
      if (this.film.justwatch_poster_path) {
        return `https://images.justwatch.com${this.film.justwatch_poster_path.replace(
          "{profile}",
          "s166"
        )}`;
      }
      return "";
    },
    reasonsSentence: function () {
      const arr = this.reasons;
      if (arr.length == 0) {
        return "";
      }
      if (arr.length === 1) {
        return arr[0];
      }
      // https://github.com/shinnn/array-to-sentence/blob/master/index.js
      return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
    },
  },
  methods: {
    showModal: function () {
      if (this.film) {
        this.$router.push({
          name: this.modalPageName,
          params: { filmId: this.film._id },
        });
      }
    },
    action: function () {
      if (this.film.just_watch_id) {
        this.$router.push({
          name: "Nominate Streaming Film",
          params: {
            justWatchId: this.film.just_watch_id,
            tmdbId: this.film.external_ids.tmdb,
            release_year: this.film.release_year,
          },
        });
      } else {
        this.showModal();
      }
    },
    getFallbackPoster: function () {
      const posters = [
        "PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiMzMzY2NkMiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4=",
        "PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiNjNjI4MjgiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4=",
        "PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiMyODM1OTMiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4=",
        "PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+PHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9Ijc1MiIgd2lkdGg9IjUwMiIgeT0iLTEiIHg9Ii0xIi8+PC9nPjxnIHN0cm9rZT0ibnVsbCI+PHRpdGxlPkxheWVyIDE8L3RpdGxlPjxyZWN0IGZpbGw9IiMxNTY1YzAiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBpZD0ic3ZnXzEiIHN0cm9rZT0ibnVsbCIvPjwvZz48L3N2Zz4=",
      ];
      return "data:image/svg+xml;base64," + selectRandom(posters);
    },
  },
};
</script>

<style scoped>
.text-smaller {
  font-size: 90% !important;
}

.poster {
  transition: opacity 0.1s ease;
}
</style>
