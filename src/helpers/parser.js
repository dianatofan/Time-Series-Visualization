import moment from 'moment';

const parseTime = timeStamp => {
  const timeString = timeStamp.split('T')[1].slice(0, -1);
  return moment(`${timeString}`, 'HHmmss').utc().format("HH:mm:ss");
};

const parseDate = timeStamp => moment(`${timeStamp.split('T')[0]}`, 'YYYYMMDDxxx').utc()
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

export const getMonthInsights = (month, dayInsights, allDays) => {
  const monthInsights = Object.keys(dayInsights)
    .filter(key => moment(key).format('M') === month)
    .reduce((obj, key) => {
      obj[key] = dayInsights[key];
      return obj;
    }, {});
  const mergedData = Object.keys(monthInsights).reduce((acc, key) => {
    acc.push(monthInsights[key]);
    return acc;
  }, []);
  const allDaysOfMonth = Object.keys(allDays)
    .filter(key => moment(key).format('M') === month)
    .reduce((obj, key) => {
      obj[key] = allDays[key];
      return obj;
    }, {});
  const mergedDays = Object.values(allDaysOfMonth).reduce((acc, val) => {
    Object.keys(val).map(key => {
      if (acc.hasOwnProperty(key)) {
        acc[key] += val[key];
      } else {
        acc[key] = val[key];
      }
    });
    return acc;
  }, {});
  return {
    selectedMonth: month,
    daysOfMonth: mergedDays,
    monthInsights: mergedData.flat()
  };
};

export const getWeekdayInsights = (weekday, dayInsights, allDays, currentWeekdays, data) => {
  const weekdayInsights = Object.keys(dayInsights)
    .filter(key => moment(key).isoWeekday() === moment(weekday, 'ddd').isoWeekday())
    .reduce((obj, key) => {
      obj[key] = dayInsights[key];
      return obj;
    }, {});
  const mergedData = Object.keys(weekdayInsights).reduce((acc, key) => {
    acc.push(weekdayInsights[key]);
    return acc;
  }, []);
  const allDaysOfMonth = Object.keys(allDays)
    .filter(key => moment(key).isoWeekday() === moment(weekday, 'ddd').isoWeekday())
    .reduce((obj, key) => {
      obj[key] = allDays[key];
      return obj;
    }, {});
  const mergedDays = Object.values(allDaysOfMonth).reduce((acc, val) => {
    Object.keys(val).map(key => {
      if (acc.hasOwnProperty(key)) {
        acc[key] += val[key];
      } else {
        acc[key] = val[key];
      }
    });
    return acc;
  }, {});

  const length = currentWeekdays && currentWeekdays.daysArr.filter(day => data[moment(day, 'DD-MM-YYYY').format('YYYY-MM-DD')]).length - 1;

  let weekdayObj = {};
  for (let i = 0; i < 24; i++) {
    weekdayObj[i] = mergedDays[i] ? Number(mergedDays[i] / length).toFixed(2) : 0
  }

  return {
    selectedWeekday: weekday,
    daysOfWeekday: mergedDays,
    weekdayInsights: mergedData.flat(),
    weekdayObj
  };
};

export const parseDayInsights = data => {
  const dayInsights = getDayInsights(data);
  return Object.keys(dayInsights).reduce((acc, item) => {
    const days = dayInsights[item];
    const roundedHours = days && days.map(hour => {
        const m = moment(`${item} ${hour}`);
        return parseInt(m.startOf('hour').format('HH'));
      }
    );
    const occurrences = roundedHours && roundedHours.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
    let obj = {};
    for (let i = 0; i <= 24; i++) {
      obj[i] = occurrences[i] || 0
    }
    acc[item] = occurrences;
    return acc;
  }, {});
};

export const getCurrentWeekInsights = (data, selectedDay, dayInsights) => {
  const startDate = moment(selectedDay).isoWeekday(1);
  const endDate = moment(selectedDay).isoWeekday(8);
  let days = [];
  let day = startDate;
  while (day.isBefore(endDate)) {
    days.push(day.toDate());
    day = day.clone().add(1, 'd');
  }
  const formattedDays = days.map(day => moment(day).format('YYYY-MM-DD'));
  const weekArray = Object.keys(data).filter(key => formattedDays.includes(key));
  let weekInsights = weekArray.reduce((acc, item) => {
    acc.push({ day: item, occurrences: dayInsights[item] });
    return acc;
  }, []);
  weekInsights = weekInsights.map(week =>
    week.occurrences.map(item => {
      const m = moment(`${week.day} ${item}`);
      return m.minute() || m.second() || m.millisecond()
        ? parseInt(m.add(1, 'hour').startOf('hour').format('HH'))
        : parseInt(m.startOf('hour').format('HH'))
    })
  );

  const length = days.filter(day => data[moment(day).format('YYYY-MM-DD')]).length;

  const weekOccurrences = [].concat.apply([], weekInsights).reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  let weekObj = {};
  for (let i = 0; i < 24; i++) {
    weekObj[i] = weekOccurrences[i] ? Number(weekOccurrences[i] / length).toFixed(2) : 0
  }

  return weekObj;
};

export const getCurrentMonthInsights = (data, selectedDay, dayInsights) => {
  const startDate = moment(selectedDay).startOf('month');
  const endDate = moment(selectedDay).endOf('month');
  let days = [];
  let day = startDate;
  while (day.isBefore(endDate)) {
    days.push(day.toDate());
    day = day.clone().add(1, 'd');
  }
  const formattedDays = days.map(day => moment(day).format('YYYY-MM-DD'));
  const monthArray = Object.keys(data).filter(key => formattedDays.includes(key));
  let monthInsights = monthArray.reduce((acc, item) => {
    acc.push({ day: item, occurrences: dayInsights[item] });
    return acc;
  }, []);
  monthInsights = monthInsights.map(month =>
    month.occurrences.map(item => {
      const m = moment(`${month.day} ${item}`);
      return m.minute() || m.second() || m.millisecond()
        ? parseInt(m.add(1, 'hour').startOf('hour').format('HH'))
        : parseInt(m.startOf('hour').format('HH'))
    })
  );

  const length = days.filter(day => data[moment(day).format('YYYY-MM-DD')]).length;

  const monthOccurrences = [].concat.apply([], monthInsights).reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  let monthObj = {};
  for (let i = 0; i < 24; i++) {
    monthObj[i] = monthOccurrences[i] ? Number(monthOccurrences[i]/ length).toFixed(2) : 0
  }

  return monthObj;
};

export const getCurrentWeek = selectedDay => {
  const startOfWeek = moment(selectedDay).startOf('isoWeek');
  const endOfWeek = moment(selectedDay).endOf('isoWeek');

  let daysArr = [];
  let dayItem = startOfWeek;

  while (dayItem <= endOfWeek) {
    daysArr.push(moment(dayItem).format('DD-MM-YYYY'));
    dayItem = dayItem.clone().add(1, 'd');
  }

  return daysArr;
};

export const getCurrentMonth = selectedDay => {
  const startOfMonth = moment(selectedDay).startOf('month');
  const endOfMonth = moment(selectedDay).endOf('month');

  let daysArr = [];
  let dayItem = startOfMonth;

  while (dayItem <= endOfMonth) {
    daysArr.push(moment(dayItem).format('DD-MM-YYYY'));
    dayItem = dayItem.clone().add(1, 'd');
  }

  return daysArr;
};

export const getCurrentWeekdays = selectedDay => {
  const start = moment(selectedDay).startOf('year');
  const end = moment(selectedDay).endOf('year');

  let daysArr = [];
  let dayItem = moment(selectedDay);

  while (dayItem <= end) {
    daysArr.push(moment(dayItem).format('DD-MM-YYYY'));
    dayItem = dayItem.clone().add(7, 'd');
  }

  let daysArr1 = [];
  let dayItem1 = moment(selectedDay);

  while (dayItem1 >= start) {
    daysArr1.push(moment(dayItem1).format('DD-MM-YYYY'));
    dayItem1 = dayItem1.clone().subtract(7, 'd');
  }

  return {
    daysArr: daysArr.concat(daysArr1),
    length: daysArr.concat(daysArr1).length
  }
};

export const getExactTimes = (selectedHour, arr) => {
  const exactTimes = arr.filter(i => moment(i, 'HH:mm:ss').format('HH') === moment(selectedHour.data, 'H').format('HH'));
  return countOccurrences(exactTimes.map(i => moment(i, 'HH:mm:ss').format('HH:mm')));
};

export default parseData;
