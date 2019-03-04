import moment from 'moment';
import * as d3 from "d3";

const parseTimestamp = timeStamp => {
  const dateString = timeStamp.split('T')[0];
  const timeString = timeStamp.split('T')[1].slice(0, -1);
  return moment(`${dateString} ${timeString}`, 'YYYYMMDD HHmmss').toDate();
};

const parseTime = timeStamp => {
  const timeString = timeStamp.split('T')[1].slice(0, -1);
  return moment(`${timeString}`, 'HHmmss').utc().format("HH:mm:ss");
};

const parseDate = timeStamp => moment(`${timeStamp.split('T')[0]}`, 'YYYYMMDDxxx')//.toDate()
  .format('YYYY-MM-DD').split('T')[0];

const countOccurrences = arr => arr.reduce(function(obj, item) {
  obj[item] = (obj[item] || 0) + 1;
  return obj;
}, {});

const parseData = data => {
  const cleanedData = data.map(item => (item[data.columns[0]]).replace(/[-:.]/g, ''));
  let newData = cleanedData.map(item => ({ timestamp: parseDate(item) }));
  // newData.push({ timestamp: parseDate(data.columns[0]) });
  const x = newData.map(item => item.timestamp);
  return countOccurrences(x);
};

const groupBy = arr => arr.reduce(function (r, a) {
  r[a.date] = r[a.date] || [];
  r[a.date].push(a.time);
  return r;
}, {});

export const getDayInsights = data => {
  let newData = data.map(item => ({ date: parseDate(item[data.columns[0]]), time: parseTime(item[data.columns[0]]) }));
  // newData.push({ date: parseDate(data.columns[0]), time: parseTimestamp(data.columns[0]) });
  return groupBy(newData);
};

export const parseDayInsights = data => {
  const dayInsights = getDayInsights(data);
  return Object.keys(dayInsights).reduce((acc, item) => {
    // debugger
    const days = dayInsights[item];
    const roundedHours = days && days.map(hour => {
        const m = moment(`${item} ${hour}`);
        return m.minute() || m.second() || m.millisecond()
          ? parseInt(m.add(1, 'hour').startOf('hour').format('HH'))
          : parseInt(m.startOf('hour').format('HH'))
      }
    );
    const occurrences = roundedHours && roundedHours.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
    const max = d3.max(Object.values(occurrences));
    const nrOfTicks = max < 10 ? max : max / 2;
    let obj = {};
    for (let i = 1; i <= 24; i++) {
      obj[i] = occurrences[i] || 0
    }
    acc[item] = occurrences;
    // acc.push(occurrences);
    return acc;
  }, {});
};

export default parseData;
