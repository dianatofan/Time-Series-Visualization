import moment from 'moment';
import * as d3 from "d3";
import {getAdjacentDayColor} from "./colors";
import {getMonthInsights, getWeekdayInsights, getWeekInsights} from "./parser";

const getUnit = props => {
  if (props.selectedMonth) {
    return 'months';
  } else if (props.selectedWeekday || props.selectedWeek) {
    return 'weeks';
  } else {
    return 'days';
  }
};

const pickDay = (day, props) => {
  props.setMonthInsights({
    monthInsights: [],
    daysOfMonth: [],
    selectedMonth: null
  });
  props.setWeekdayInsights({
    selectedWeekday: null,
    daysOfWeekday: [],
    weekdayInsights: []
  });
  props.setWeekInsights({
    weekInsights: [],
    daysOfWeek: [],
    selectedWeek: null
  });
  const color = props.colors.find(color => color.day === moment(day).format('DD-MM-YYYY'));
  let value = color && d3.color(color.value);
  if (!value) {
    value = getAdjacentDayColor(props, moment(day).format('DD-MM-YYYY'), moment(day).startOf('month'));
    props.saveColor({ day: moment(day).format('DD-MM-YYYY'), value });
  }
  props.selectDay({ day, color: value, data: props.data });
  props.showBarChart(true);
};

const pickWeek = (week, props) => {
  props.selectDay(null);
  props.setWeekdayInsights({
    selectedWeekday: null,
    daysOfWeekday: [],
    weekdayInsights: []
  });
  props.setMonthInsights({
    monthInsights: [],
    daysOfMonth: [],
    selectedMonth: null
  });
  const weekInsights = getWeekInsights(week, props.dayInsights, props.allDays);
  props.setWeekInsights({
    selectedWeek: weekInsights.selectedWeek,
    daysOfWeek: weekInsights.daysOfWeek,
    weekInsights: weekInsights.weekInsights
  });
  props.showBarChart(true);
};

const pickMonth = (month, props) => {
  props.selectDay(null);
  props.setWeekdayInsights({
    selectedWeekday: null,
    daysOfWeekday: [],
    weekdayInsights: []
  });
  props.setWeekInsights({
    weekInsights: [],
    daysOfWeek: [],
    selectedWeek: null
  });
  const monthInsights = getMonthInsights(month.toString(), props.dayInsights, props.allDays);
  props.setMonthInsights({
    selectedMonth: monthInsights.selectedMonth,
    daysOfMonth: monthInsights.daysOfMonth,
    monthInsights: monthInsights.monthInsights
  });
  props.showBarChart(true);
};

const pickWeekday = (weekday, props) => {
  props.selectDay(null);
  props.setMonthInsights({
    monthInsights: [],
    daysOfMonth: [],
    selectedMonth: null
  });
  const weekdayInsights = getWeekdayInsights(weekday, props.dayInsights, props.allDays, props.currentWeekdays, props.data);
  props.setWeekdayInsights({
    weekdayInsights: weekdayInsights.weekdayInsights,
    daysOfWeekday: weekdayInsights.daysOfWeekday,
    selectedWeekday: weekdayInsights.selectedWeekday
  });
  props.showBarChart(true);
};

export const select = (val, props) => {
  const selectedItem = props.selectedMonth || props.selectedWeekday || props.selectedDay || props.selectedWeek;
  const unit = getUnit(props);

  if (props.selectedDay) {
    pickDay(moment(selectedItem).add(val, unit), props);
  } else if (props.selectedWeek) {
    pickWeek(parseInt(props.selectedWeek) + val, props);
  } else if (props.selectedMonth) {
    pickMonth(parseInt(selectedItem) + val, props);
  } else if (props.selectedWeekday) {
    const isoWeekday = moment(selectedItem, 'ddd').isoWeekday();
    pickWeekday((moment(selectedItem, 'ddd').isoWeekday(isoWeekday + val)).format('ddd'), props);
  }
};
