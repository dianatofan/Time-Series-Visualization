import moment from 'moment';
import * as d3 from 'd3';

export const getAverageColor = (selectedMonth, selectedWeekday, colors) => {
  let rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  const filteredColors = selectedMonth
    ? colors.filter(color => moment(color.day, 'DD-MM-YYYY').format('M') === selectedMonth)
    : colors.filter(color => moment(color.day, 'DD-MM-YYYY').format('ddd') === selectedWeekday);

  filteredColors.forEach(color => {
    rgb.r += color.value.r;
    rgb.g += color.value.g;
    rgb.b += color.value.b;
  });

  return d3.rgb(rgb.r / filteredColors.length, rgb.g / filteredColors.length, rgb.b / filteredColors.length);
};

const normalize = (val, max, min) => (1 - 0.25) * ((val - min) / (max - min)) + 0.25;

export const getDayColor = (props, isCurrentDay) => {
  const item = Object.keys(props.data).find(key => new Date(key).setHours(0,0,0,0) === props.day.setHours(0,0,0,0));

  if (item) {
    const isCurrentWeek = props.currentWeek && props.currentWeek.includes(moment(props.day).format('DD-MM-YYYY')) && props.showWeekOverview;
    const isCurrentMonth = (props.currentMonth && props.currentMonth.includes(moment(props.day).format('DD-MM-YYYY')) && props.showMonthOverview) ||
      (props.selectedMonth && props.selectedMonth === moment(props.day).format('M'));
    const isCurrentWeekday = (props.currentWeekdays && props.currentWeekdays.daysArr.includes(moment(props.day).format('DD-MM-YYYY')) && props.showWeekdayOverview) ||
      (props.selectedWeekday && props.selectedWeekday === moment(props.day).format('ddd'));

    const value = props.data[item] && normalize(props.data[item], Math.max(...Object.values(props.data)), Math.min(...Object.values(props.data)));
    const interpolateColor = (isCurrentDay || isCurrentWeek || isCurrentMonth || isCurrentWeekday) ? d3.interpolateOranges(value) : d3.interpolatePurples(value);

    const isColorSaved = props.colors.find(color => color.day === moment(props.day).format('DD-MM-YYYY'));
    !isColorSaved && props.saveColor({ day: moment(props.day).format('DD-MM-YYYY'), value: d3.color(d3.interpolateOranges(value)) });

    return {
      value,
      count: props.data[item] || 0,
      fillColor: interpolateColor
    }
  }

  return {
    fillColor: '#ececec'
  };
};
