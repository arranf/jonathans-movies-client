import humanizeDuration from 'humanize-duration'
import store from '@/store'

const functions = {
  shuffle: function (a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]]
    }
  },
  humanizeTimeToNow: function (dateTimeEpochms) {
    const time = store.getters['time/getNow']
    return humanizeDuration(dateTimeEpochms - time, { units: ['h', 'm', 's'], largest: 2, round: true })
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
  }
}
export default functions
