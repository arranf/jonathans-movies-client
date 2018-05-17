import humanizeDuration from 'humanize-duration'
import store from '@/store'
import constants from './constants'

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

const shuffle = function (a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]]
  }
}

const functions = {
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
  getUniqueColors: function (count) {
    let array = JSON.parse(JSON.stringify(constants.colors['800']))

    while (count > array.length) {
      array.concat(JSON.parse(JSON.stringify(constants.colors['800'])))
    }
    shuffle(array)
    if (count < array.length) {
      array = array.slice(0, count)
    }
    return array
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
    return `https://image.tmdb.org/t/p/w1280${slug}`
  },
  getTmdbPosterImage: function (slug) {
    return `https://image.tmdb.org/t/p/w342/${slug}`
  },
  getTmdbPosterSrcSet: function (slug) {
    return `https://image.tmdb.org/t/p/w154${slug} 154w,https://image.tmdb.org/t/p/w185${slug} 185w,https://image.tmdb.org/t/p/w342${slug} 342w,https://image.tmdb.org/t/p/w500${slug} 500w`
  },
  tmdbPosterSizes: '(min-width: 1080px) 333px, (min-width: 1024px) 280px, (min-width: 768px) 233px, 124px',
  getYearFromTmdbReleaseDate: function (releaseDate) {
    if (!releaseDate) {
      return ''
    }
    return new Date(releaseDate).getFullYear()
  }
}
export default functions
