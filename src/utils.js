import humanizeDuration from 'humanize-duration'

const functions = {
  shuffle: function (a) {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]]
    }
  },
  humanizeTimeToNow: function (dateTimeEpochms) {
    let currentTimeEpochms = new Date().getTime()
    return humanizeDuration(dateTimeEpochms - currentTimeEpochms, { units: ['h', 'm', 's'], largest: 2, round: true })
  }
}
export default functions
