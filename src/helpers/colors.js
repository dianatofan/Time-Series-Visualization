import moment from 'moment';
import * as d3 from 'd3';

const getDaysArrayByMonth = (month, year, data) => {
  let daysInMonth = moment(month, 'M').daysInMonth();
  const arrDays = [];

  while(daysInMonth) {
    const current = moment(month, 'M').date(daysInMonth).format(`${year}-MM-DD`);
    Object.keys(data).find(key => key === current) && arrDays.push(current);
    daysInMonth--;
  }
  return arrDays;
};

export const getAverageColor = props => {
  let rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  let filteredColors = [];
  const insertMissingColors = daysArray => {
    daysArray.forEach(day => {
      if (!filteredColors.find(color => moment(color.day, 'DD-MM-YYYY').format('YYYY-MM-DD') === day)) {
        const value = d3.color(d3.interpolateOranges(getValue(props.data, day, moment(day).startOf('month'))));
        filteredColors.push({
          day,
          value
        });
        // props.saveColor({ day: moment(day).format('DD-MM-YYYY'), value });
      }
    })
  };
  if (props.selectedWeek) {
    filteredColors = props.colors.filter(color => moment(color.day).isoWeek() === props.selectedWeek && d3.rgb(color));
    const daysArray = Object.keys(props.allDays).filter(key => moment(key).isoWeek() === props.selectedWeek);
    insertMissingColors(daysArray);
  }

  if (props.selectedMonth) {
    filteredColors = props.colors.filter(color => moment(color.day, 'DD-MM-YYYY').format('M') === props.selectedMonth && d3.rgb(color));
    const daysArray = getDaysArrayByMonth(props.selectedMonth, moment(props.minDate).format('YYYY'), props.data);
    insertMissingColors(daysArray);
  }

  if (props.selectedWeekday) {
    filteredColors = props.colors.filter(color => moment(color.day, 'DD-MM-YYYY').format('ddd') === props.selectedWeekday && d3.rgb(color));
    const daysArray = Object.keys(props.allDays).filter(key => moment(key).isoWeekday() === moment(props.selectedWeekday, 'ddd').isoWeekday());
    insertMissingColors(daysArray);
  }

  filteredColors.forEach(color => {
    rgb.r += color.value.r;
    rgb.g += color.value.g;
    rgb.b += color.value.b;
  });

  return d3.rgb(rgb.r / filteredColors.length, rgb.g / filteredColors.length, rgb.b / filteredColors.length);
};

const normalize = (val, max, min) => (1 - 0.25) * ((val - min) / (max - min)) + 0.25;

const getValue = (data, item, month) => {
  const daysArr = Array.from({length: moment(month).daysInMonth()}, (x, i) => moment(month).startOf('month').add(i, 'days').format('YYYY-MM-DD'));

  const count = Object.keys(data).reduce((acc, item) => {
    daysArr.includes(item) && acc.push(data[item]);
    return acc;
  }, []);

  return !!data[item] && normalize(data[item], Math.max(...count), Math.min(...count));
};

const contains = (arr, showOverview, item) => {
  if (arr && showOverview) {
    let i = arr.length;
    while (i--) {
      if (arr[i] === item) {
        return true;
      }
    }
    return false;
  }
};

export const getAdjacentDayColor = (props, day, monthVal) => {
  const item = Object.keys(props.data).find(key => moment(key, 'YYYY-MM-DD').format('DD-MM-YYYY') === day);
  const month = monthVal ? monthVal : props.month;
  if (item) {
    const value = getValue(props.data, item, month);
    return d3.color(d3.interpolateOranges(value));
  }
  return '#ececec';
};

export const getDayColor = (props, isCurrentDay) => {
  const item = Object.keys(props.data).find(key => new Date(key).setHours(0,0,0,0) === props.day.setHours(0,0,0,0));

  if (item) {
    const day = moment(props.day).format('DD-MM-YYYY');

    const isCurrentWeek = contains(props.currentWeek, props.showWeekOverview, day) ||
      (props.selectedWeek && props.selectedWeek === moment(props.day).isoWeek()) ||
      (!!props.shiftSelection.length && props.shiftSelection.indexOf(moment(props.day).isoWeek()) > -1);
    const isCurrentMonth = contains(props.currentMonth, props.showMonthOverview, day) ||
      (props.selectedMonth && props.selectedMonth === moment(props.day).format('M')) ||
      (!!props.shiftSelection.length && props.shiftSelection.indexOf(moment(props.day).format('MMMM')) > -1);
    const isCurrentWeekday = contains(props.currentWeekdays.daysArr, props.showWeekdayOverview, day) ||
      (props.selectedWeekday && props.selectedWeekday === moment(props.day).format('ddd')) ||
      (!!props.shiftSelection.length && props.shiftSelection.indexOf(moment(props.day).format('ddd')) > -1);
    const isSelected = !!props.shiftSelection.length &&
      (props.shiftSelection.indexOf(moment(props.day).format('YYYY-MM-DD')) > -1 ||
        props.shiftSelection.indexOf('all') > -1);

    const value = getValue(props.data, item, props.month);
    const interpolateColor = (isCurrentDay || isSelected || isCurrentWeek || isCurrentMonth || isCurrentWeekday) ? d3.interpolateOranges(value) : d3.interpolatePurples(value);

    return {
      value,
      count: props.data[item],
      fillColor: interpolateColor
    }
  }

  return {
    fillColor: '#ececec',
    count: 0
  };
};