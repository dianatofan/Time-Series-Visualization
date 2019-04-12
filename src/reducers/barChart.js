import {getCurrentWeek, getCurrentMonth, getCurrentWeekdays} from "../helpers/parser";

const SHOW_BAR_CHART = 'SHOW_BAR_CHART';
const SELECT_DAY = 'SELECT_DAY';
const SHOW_WEEK_OVERVIEW = 'SHOW_WEEK_OVERVIEW';
const SHOW_MONTH_OVERVIEW = 'SHOW_MONTH_OVERVIEW';
const SHOW_WEEKDAY_OVERVIEW = 'SHOW_WEEKDAY_OVERVIEW';

const initialState = {
  isBarChartVisible: false,
  selectedDay: null,
  currentWeek: null,
  currentMonth: null,
  currentWeekdays: null,
  showWeekOverview: false,
  showMonthOverview: false,
  showWeekdayOverview: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_BAR_CHART:
      return {
        ...state,
        isBarChartVisible: action.val
      };
    case SELECT_DAY:
      return {
        ...state,
        selectedDay: action.val,
        currentWeek: getCurrentWeek(action.val),
        currentMonth: getCurrentMonth(action.val),
        currentWeekdays: getCurrentWeekdays(action.val)
      };
    case SHOW_WEEK_OVERVIEW:
      return {
        ...state,
        showWeekOverview: action.val
      };
    case SHOW_MONTH_OVERVIEW:
      return {
        ...state,
        showMonthOverview: action.val
      };
    case SHOW_WEEKDAY_OVERVIEW:
      return {
        ...state,
        showWeekdayOverview: action.val
      };
    default:
      return state;
  }
}

export const showBarChart = val => ({ type: SHOW_BAR_CHART, val });
export const selectDay = val => ({ type: SELECT_DAY, val });
export const showWeekOverview = val => ({ type: SHOW_WEEK_OVERVIEW, val });
export const showMonthOverview = val => ({ type: SHOW_MONTH_OVERVIEW, val });
export const showWeekdayOverview = val => ({ type: SHOW_WEEKDAY_OVERVIEW, val });
