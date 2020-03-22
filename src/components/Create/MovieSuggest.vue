<template>
  <div>
    <div class="search-box">
      <input
        @input="searchQuery = $event.target.value"
        aria-label="Search"
        :value="searchQuery"
        :class="{ 'focused': focused }"
        autocomplete="off"
        spellcheck="false"
        @focus="focused = true"
        @blur="focused = false"
        @keyup.enter="choose(getIdFromFocusIndex(id))"
        @keyup.up="onUp"
        @keyup.down="onDown"
      />
      <ul class="suggestions" v-if="suggestions.length > 0 && !loading" @mouseleave="unfocus">
        <li
          class="suggestion"
          v-for="(s, i) in suggestions"
          :key="s._id"
          :class="{ focused: i === focusIndex }"
          @click="choose(s._id)"
          @mouseenter="focus(i)"
        >
          <v-list-tile-content>
            <v-list-tile-title v-html="getName(s)"></v-list-tile-title>
            <v-list-tile-sub-title v-if="s.release_date" v-html="getYear(s.release_date)" />
          </v-list-tile-content>
        </li>
      </ul>
      <!-- <v-progress-linear v-else-if="loading" indeterminate slot="progress" height="4"/> -->
    </div>

    <div class="selected">
      <template v-for="c in selected">
        <v-chip :key="'c' + c._id">{{c.name}}</v-chip>
        <v-btn :key="'b' + c._id" icon small @click.prevent="remove(c._id)">x</v-btn>
      </template>
    </div>
  </div>
</template>

<script>
import { getFilmSuggestions } from '@/api'
import { getYearFromTmdbReleaseDate } from '@/utils'

const SEARCH_QUERY_ID = '$searchQuery'

export default {
  data () {
    return {
      suggestions: [],
      searchQuery: null,
      loading: false,

      focused: false,
      focusIndex: 0,
      selected: []
    }
  },
  props: {
    placeholder: String,
    errors: Array
  },
  watch: {
    searchQuery (newInput, oldInput) {
      if (newInput && newInput.trim()) {
        this.getSuggestions(newInput)
      }
    }
  },
  methods: {
    getSuggestions: async function (searchTerm) {
      this.loading = true
      let response = await getFilmSuggestions(searchTerm)

      // Reset array
      this.suggestions.splice(0, this.suggestions.length)
      if (response && response.data && response.data.length) {
        response.data.forEach(a => this.suggestions.push(a))
      }
      this.suggestions.push({
        _id: SEARCH_QUERY_ID,
        value: this.searchQuery,
        name: this.searchQuery
      })

      this.loading = false
    },
    // addNonPredictedFilm: function () {
    //   // TODO: Make this component handle movies that aren't searchable films (i.e. Someone brings a movie to Jonathans)
    //   // Trigger Code on the component: @keyup.native.enter="addNonPredictedFilm"
    //   const searchQuery = this.searchQuery.trim()
    //   if (searchQuery !== '') {
    //     const newFilm = { name: searchQuery, _id: null }
    //     this.selected.push(newFilm)
    //     this.searchQuery = ''
    //     this.fillBox()
    //   },
    optionsChange: function (event) {
      const reducedOptions = this.selected.map(f => {
        if (f) {
          return { name: f.name, film_id: f._id }
        }
      })
      this.$emit('optionsChange', reducedOptions)
    },
    getYear: function (releaseDate) {
      return `(${getYearFromTmdbReleaseDate(releaseDate)})`
    },
    // Handles the case where we want to identify an option as _not_ a film in the db
    getName: function (suggestion) {
      if (suggestion.id === SEARCH_QUERY_ID) {
        return `${suggestion.name} <small>(Not in database)</small>`
      }
      return suggestion.name
    },
    choose: function (id) {
      this.selected.push(this.suggestions.find(a => a._id === id))
      const reducedOptions = this.selected.map(f => {
        if (f) {
          return { name: f.name, film_id: f._id }
        }
      })
      this.$emit('optionsChange', reducedOptions)
      this.suggestions = []
      this.searchQuery = ''
    },
    remove: function (id) {
      this.selected.splice(
        this.suggestions.indexOf(a => a._id === id),
        1
      )
      const reducedOptions = this.selected.map(f => {
        if (f) {
          return { name: f.name, film_id: f._id }
        }
      })
      this.$emit('optionsChange', reducedOptions)
    },
    onUp () {
      if (this.suggestions.length > 0) {
        if (this.focusIndex > 0) {
          this.focusIndex--
        } else {
          this.focusIndex = this.suggestions.length - 1
        }
      }
    },
    onDown () {
      if (this.suggestions.length > 0) {
        if (this.focusIndex < this.suggestions.length - 1) {
          this.focusIndex++
        } else {
          this.focusIndex = 0
        }
      }
    },
    focus (i) {
      this.focusIndex = i
    },
    unfocus () {
      this.focusIndex = -1
    },
    getIdFromFocusIndex (i) {
      return this.suggestions[i]._id
    }
  }
}
</script>

<style scoped>
.selected {
  margin-top: 2em;
}

.search-box {
  display: inline-block;
  position: relative;
  margin-left: 1rem;
  min-width: 80%;
}
.search-box input {
  cursor: text;
  width: 100%;
  color: #4e6e8e;
  display: inline-block;
  border: 1px solid #3e98af;
  border-radius: 2rem;
  font-size: 0.9rem;
  line-height: 2rem;
  padding: 0 0.5rem 0 2rem;
  outline: none;
  transition: all 0.2s ease;
  /* background: #fff url("../styles/search.svg") 0.6rem 0.5rem no-repeat; */
  background-size: 1rem;
}
.search-box input:focus {
  cursor: auto;
  border-color: #3eaf7c;
}
.search-box .suggestions {
  background: #fff;
  width: 20rem;
  position: absolute;
  top: 1.5rem;
  border: 1px solid #cfd4db;
  border-radius: 6px;
  padding: 0.4rem;
  list-style-type: none;
  z-index: 98;
}
.search-box .suggestions.align-right {
  right: 0;
}
.search-box .suggestion {
  line-height: 1.4;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}
.search-box .suggestion a {
  white-space: normal;
  color: #5d82a6;
}
.search-box .suggestion a .page-title {
  font-weight: 600;
}
.search-box .suggestion a .header {
  font-size: 0.9em;
  margin-left: 0.25em;
}
.search-box .suggestion.focused {
  background-color: #f3f4f5;
}
.search-box .suggestion.focused a {
  color: #3eaf7c;
}
@media (max-width: 959px) {
  .search-box input {
    cursor: pointer;
    /* width: 0; */
    /* border-color: transparent; */
    position: relative;
  }
  .search-box input:focus {
    cursor: text;
    left: 0;
    /* width: 10rem; */
  }
}
@media (max-width: 959px) and (min-width: 719px) {
  .search-box .suggestions {
    left: 0;
  }
}
@media (max-width: 719px) {
  .search-box {
    margin-right: 0;
  }
  .search-box input {
    left: 1rem;
  }
  .search-box .suggestions {
    right: 0;
  }
}
@media (max-width: 419px) {
  .search-box .suggestions {
    width: calc(100vw - 4rem);
  }
  .search-box input:focus {
    width: 8rem;
  }
}
</style>
