import moment from 'moment'

function fillGaps(rawDays, length) {
  let days = _.map(rawDays, (v, k) => {
    return {
      v,
      i: parseInt(k.split("EMPTY_")[1]) || 0
    }
  })

  let lastRawDay;

  return _.map(new Array(length), (_undefined, i) => {
    let rawDay = _.find(days, {i})
    if (rawDay != undefined)
      lastRawDay = rawDay
    return lastRawDay.v;
  })
}

export default function(data) {
  let times = Object.values(data[3]);
  let months = fillGaps(data[1], times.length);
  let days = fillGaps(data[2], times.length).map(v => v.split(' ')[1]);
  return _.zip(months, days, times).map(arr => moment(arr.join(' '), "MMMM YYYY DD hh:mm A"))
}
