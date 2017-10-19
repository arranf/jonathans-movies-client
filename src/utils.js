import humanizeDuration from 'humanize-duration'
import store from '@/store'

let shortHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      h: function () { return 'h' },
      m: function () { return 'm' },
      s: function () { return 's' }
    }
  },
  units: ['h', 'm', 's'],
  largest: 2,
  round: true
})

const functions = {
  shuffle: function (a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]]
    }
  },
  humanizeTimeToNowPrecise: function (dateTimeEpochms) {
    const time = store.getters['time/getNow']
    return shortHumanizer(dateTimeEpochms - time)
  },
  humanizeTimeToNowImprecise: function (dateTimeEpochms) {
    const time = store.getters['time/getNow']
    return humanizeDuration(dateTimeEpochms - time, { units: ['mo', 'w', 'd', 'h', 'm'], largest: 1, round: true })
  },
  selectRandom: function (array) {
    return array[Math.floor(Math.random() * array.length)]
  },
  getHighestVotedOptions: function (arr) {
    const maxVote = arr.reduce((acc, value) => {
      return (acc > value.totalVotes ? acc : value.totalVotes)
    }, 0)
    return arr.reduce((acc, value) => {
      if (value.totalVotes === maxVote) {
        acc.push(value)
      }
      return acc
    }, [])
  },
  getTmdbBackdropImage: function (slug) {
    return `https://image.tmdb.org/t/p/w1280/${slug}`
  },
  getTmdbPosterImage: function (slug) {
    return `https://image.tmdb.org/t/p/w342${slug}`
  },
  getYearFromTmdbReleaseDate: function (releaseDate) {
    return new Date(releaseDate).getFullYear()
  },
  showModal: function (vue, filmId) {
    vue.$modal.show(`${filmId}-modal`)
  },
  hideModal: function (vue, filmId) {
    vue.$modal.hide(`${filmId}-modal`)
  }
}
export default functions
