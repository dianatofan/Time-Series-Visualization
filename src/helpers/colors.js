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
