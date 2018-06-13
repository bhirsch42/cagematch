export default function(data, dates) {
  let peopleRows = data.slice(4, data.length - 1);
  return peopleRows.map(peopleRow => {
    let values = Object.values(peopleRow)
    let name = values.shift();
    let datesAvailable = values.
      map((available, i) => available == "OK" ? dates[i] : false).
      filter(date => date);

    return {name, dates: datesAvailable};
  })
}

