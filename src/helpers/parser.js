import moment from 'moment';

const parseTime = (timeStamp, offset) => {
  const timeString = timeStamp.split('T')[1].slice(0, -1);
  const value = offset || (timeStamp.split(';')[1]).split(';')[0];
  return moment.utc(`${timeString}`, 'HH:mm:ss').utcOffset(value).format('HH:mm:ss');
};

const parseDate = timeStamp => moment(`${timeStamp.split('T')[0]}`, 'YYYYMMDDxxx')
  .format('YYYY-MM-DD').split('T')[0];

const countOccurrences = arr => arr.reduce(function(obj, item) {
  obj[item] = (obj[item] || 0) + 1;
  return obj;
}, {});

const parseData = data => {
  const cleanedData = data.map(item => (item[data.columns[0]]).replace(/[-:.]/g, ''));
  let newData = cleanedData.map(item => ({ timestamp: parseDate(item) }));
  newData.unshift({ timestamp: parseDate(data.columns[0]) });
  const x = newData.map(item => item.timestamp);
  return countOccurrences(x);
};

const groupBy = arr => arr.reduce(function (r, a) {
  r[a.date] = r[a.date] || [];
  r[a.date].push(a.time);
  return r;
}, {});

export const getDayInsights = data => {
  let newData = data.map(item => ({ date: parseDate(item[data.columns[0]]), time: parseTime(item[data.columns[0]], item[data.columns[1]]) }));
  newData.unshift({ date: parseDate(data.columns[0]), time: parseTime(data.columns[0], data.columns[1]) });
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
      return null;
    });
    return acc;
  }, {});
  return {
    selectedMonth: month,
    daysOfMonth: mergedDays,
    monthInsights: mergedData.flat()
  };
};

export const getWeekInsights = (week, dayInsights, allDays) => {
  const weekInsights = Object.keys(dayInsights)
    .filter(key => {
      return moment(key).isoWeekday(1).format('w') === week.toString()
    })
    .reduce((obj, key) => {
      obj[key] = dayInsights[key];
      return obj;
    }, {});
  const mergedData = Object.keys(weekInsights).reduce((acc, key) => {
    acc.push(weekInsights[key]);
    return acc;
  }, []);
  const allDaysOfWeek = Object.keys(allDays)
    .filter(key => moment(key).isoWeek() === week)
    .reduce((obj, key) => {
      obj[key] = allDays[key];
      return obj;
    }, {});
  const mergedDays = Object.values(allDaysOfWeek).reduce((acc, val) => {
    Object.keys(val).map(key => {
      if (acc.hasOwnProperty(key)) {
        acc[key] += val[key];
      } else {
        acc[key] = val[key];
      }
      return null;
    });
    return acc;
  }, {});
  return {
    selectedWeek: week,
    daysOfWeek: mergedDays,
    weekInsights: mergedData.flat()
  };
};

export const getDatasetOverview = (allDays, data, dayInsights) => {
  const weekdayInsights = Object.keys(dayInsights)
    .reduce((obj, key) => {
      const weekday = moment(key, 'YYYY-MM-DD').format('ddd');
      obj[weekday] = obj[weekday] || [];
      obj[weekday].push(dayInsights[key]);
      return obj;
    }, {});
  return Object.keys(weekdayInsights)
    .reduce((obj, key) => {
      obj[key] = weekdayInsights[key].flat().length;
      return obj;
    }, {});
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
      return null;
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

export const getShiftSelectionInsights = (shiftSelection, data, dayInsights, allDays) => {
  const shiftInsights = Object.keys(dayInsights)
    .filter(key => shiftSelection.indexOf(moment(key).format('MMMM')) > -1 ||
      shiftSelection.indexOf(moment(key).isoWeek()) > -1 ||
      shiftSelection.indexOf(moment(key).format('ddd')) > -1 ||
      shiftSelection.indexOf(key) > -1 ||
      shiftSelection.indexOf('all') > -1)
    .reduce((obj, key) => {
      obj[key] = dayInsights[key];
      return obj;
    }, {});

  const mergedData = Object.keys(shiftInsights).reduce((acc, key) => {
    acc.push(shiftInsights[key]);
    return acc;
  }, []);

  const allSelectedDays = Object.keys(allDays)
    .filter(key => shiftSelection.indexOf(moment(key).format('MMMM')) > -1 ||
      shiftSelection.indexOf(moment(key).isoWeek()) > -1 ||
      shiftSelection.indexOf(moment(key).format('ddd')) > -1 ||
      shiftSelection.indexOf(key) > -1 ||
      shiftSelection.indexOf('all') > -1)
    .reduce((obj, key) => {
      obj[key] = allDays[key];
      return obj;
    }, {});

  const mergedDays = Object.values(allSelectedDays).reduce((acc, val) => {
    Object.keys(val).map(key => {
      if (acc.hasOwnProperty(key)) {
        acc[key] += val[key];
      } else {
        acc[key] = val[key];
      }
      return null;
    });
    return acc;
  }, {});

  let selectedDaysObj = {};
  for (let i = 0; i < 24; i++) {
    selectedDaysObj[i] = mergedDays[i] ? Number(mergedDays[i] / shiftSelection.length).toFixed(2) : 0
  }

  return {
    shiftSelection,
    selectedDays: mergedDays,
    selectedDaysInsights: mergedData.flat(),
    selectedDaysObj
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
  const days = Array.from({length: 7}, (x, i) => moment(selectedDay).startOf('isoWeek').add(i, 'days').format('YYYY-MM-DD'));
  const weekArray = Object.keys(data).filter(key => days.includes(key));
  let weekInsights = weekArray.reduce((acc, item) => {
    acc.push({ day: item, occurrences: dayInsights[item] });
    return acc;
  }, []);
  weekInsights = weekInsights.map(week =>
    week.occurrences.map(item => {
      const m = moment(`${week.day} ${item}`);
      return parseInt(m.startOf('hour').format('HH'));
    })
  );
  const length = days.filter(item => data[item]).length;
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
  const days = Array.from({length: moment(selectedDay).daysInMonth()}, (x, i) => moment(selectedDay).startOf('isoMonth').add(i, 'days').format('YYYY-MM-DD'));
  const monthArray = Object.keys(data).filter(key => days.includes(key));
  let monthInsights = monthArray.reduce((acc, item) => {
    acc.push({ day: item, occurrences: dayInsights[item] });
    return acc;
  }, []);
  monthInsights = monthInsights.map(month =>
    month.occurrences.map(item => {
      const m = moment(`${month.day} ${item}`);
      return parseInt(m.startOf('hour').format('HH'));
    })
  );
  const length = days.filter(item => data[item]).length;
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


const contains = (item, arr) => {
  let i = arr.length;
  while (i--) {
    if (arr[i] === item) {
      return true;
    }
  }
  return false;
};

export const getCurrentWeek = (selectedDay, data) => {
  const startOfWeek = moment(selectedDay).startOf('isoWeek');
  const endOfWeek = moment(selectedDay).endOf('isoWeek');

  let daysArr = [];
  let dayItem = startOfWeek;

  while (dayItem <= endOfWeek) {
    contains(moment(dayItem).format('YYYY-MM-DD'), Object.keys(data)) && daysArr.push(moment(dayItem).format('DD-MM-YYYY'));
    dayItem = dayItem.clone().add(1, 'd');
  }

  return daysArr;
};

export const getCurrentMonth = (selectedDay, data) => {
  const startOfMonth = moment(selectedDay).startOf('month');
  const endOfMonth = moment(selectedDay).endOf('month');

  let daysArr = [];
  let dayItem = startOfMonth;

  while (dayItem <= endOfMonth) {
    contains(moment(dayItem).format('YYYY-MM-DD'), Object.keys(data)) && daysArr.push(moment(dayItem).format('DD-MM-YYYY'));
    dayItem = dayItem.clone().add(1, 'd');
  }

  return daysArr;
};

export const getCurrentWeekdays = (selectedDay, data) => {
  const start = moment(selectedDay).startOf('year');
  const end = moment(selectedDay).endOf('year');

  let daysArr = [];
  let dayItem = moment(selectedDay);

  while (dayItem <= end) {
    contains(moment(dayItem).format('YYYY-MM-DD'), Object.keys(data)) && daysArr.push(moment(dayItem).format('DD-MM-YYYY'));
    dayItem = dayItem.clone().add(7, 'd');
  }

  let daysArr1 = [];
  let dayItem1 = moment(selectedDay);

  while (dayItem1 >= start) {
    contains(moment(dayItem1).format('YYYY-MM-DD'), Object.keys(data)) && daysArr1.push(moment(dayItem1).format('DD-MM-YYYY'));
    dayItem1 = dayItem1.clone().subtract(7, 'd');
  }

  const array = [...new Set(daysArr.concat(daysArr1))];

  return {
    daysArr: array,
    length: array.length
  }
};

export const getExactTimes = (selectedHour, arr) => {
  const exactTimes = arr.filter(i => moment(i, 'HH:mm:ss').format('HH') === moment(selectedHour.data, 'H').format('HH'));
  return countOccurrences(exactTimes.map(i => moment(i, 'HH:mm:ss').format('HH:mm')));
};

export default parseData;
