import moment from 'moment';

const parseTimestamp = timeStamp => {
  const dateString = timeStamp.split('T')[0];
  const timeString = timeStamp.split('T')[1].slice(0, -1);
  return moment(`${dateString} ${timeString}`, 'YYYYMMDD HHmmss');
};

const parseData = data => {
  let newData = data.map(item => ({ timestamp: parseTimestamp(item[data.columns[0]]) }));
  newData.push({ timestamp: parseTimestamp(data.columns[0]) });
  return newData;
};

export default parseData;
