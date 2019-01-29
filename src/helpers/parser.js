import moment from 'moment';

const parseTimestamp = timeStamp => {
  const dateString = timeStamp.split('T')[0];
  const timeString = timeStamp.split('T')[1].slice(0, -1);
  return moment(`${dateString} ${timeString}`, 'YYYYMMDD HHmmss').toDate();
};

const parseTime = timeStamp => {
  const timeString = timeStamp.split('T')[1].slice(0, -1);
  return moment(`${timeString}`, 'HHmmss').format("HH:mm:ss");
};

const parseDate = timeStamp => moment(`${timeStamp.split('T')[0]}`, 'YYYYMMDD')//.toDate()
  .format('YYYY-MM-DD').split('T')[0];

const countOccurrences = arr => arr.reduce(function(obj, item) {
  obj[item] = (obj[item] || 0) + 1;
  return obj;
}, {});

const parseData = data => {
  let newData = data.map(item => ({ timestamp: parseDate(item[data.columns[0]]) }));
  newData.push({ timestamp: parseDate(data.columns[0]) });
  const x = newData.map(item => item.timestamp);
  return countOccurrences(x);
};

const groupBy = arr => arr.reduce(function (r, a) {
  r[a.date] = r[a.date] || [];
  r[a.date].push(a.time);
  return r;
}, Object.create(null));

export const getDayInsights = data => {
  let newData = data.map(item => ({ date: parseDate(item[data.columns[0]]), time: parseTime(item[data.columns[0]]) }));
  newData.push({ date: parseDate(data.columns[0]), time: parseTimestamp(data.columns[0]) });
  return groupBy(newData);
};

export default parseData;
