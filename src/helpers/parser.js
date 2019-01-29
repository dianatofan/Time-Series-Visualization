import moment from 'moment';

const parseTimestamp = timeStamp => {
  const dateString = timeStamp.split('T')[0];
  const timeString = timeStamp.split('T')[1].slice(0, -1);
  return moment(`${dateString} ${timeString}`, 'YYYYMMDD HHmmss').toDate();
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
  // return newData;
};

export default parseData;
