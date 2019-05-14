import { getExactTimes } from '../helpers/parser';

const SHOW_BAR_CHART = 'SHOW_BAR_CHART';
const SHOW_WEEK_OVERVIEW = 'SHOW_WEEK_OVERVIEW';
const SHOW_MONTH_OVERVIEW = 'SHOW_MONTH_OVERVIEW';
const SHOW_WEEKDAY_OVERVIEW = 'SHOW_WEEKDAY_OVERVIEW';
const OPEN_MODAL = 'OPEN_MODAL';
const RESET = 'RESET';

const initialState = {
  isBarChartVisible: false,
  showWeekOverview: false,
  showMonthOverview: false,
  showWeekdayOverview: false,
  modalData: null,
  timeArray: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_BAR_CHART:
      return {
        ...state,
        isBarChartVisible: action.val,
        showWeekOverview: false,
        showMonthOverview: false,
        showWeekdayOverview: false
      };
    case SHOW_WEEK_OVERVIEW:
      return {
        ...state,
        showWeekOverview: action.val,
        showMonthOverview: false,
        showWeekdayOverview: false
      };
    case SHOW_MONTH_OVERVIEW:
      return {
        ...state,
        showMonthOverview: action.val,
        showWeekOverview: false,
        showWeekdayOverview: false
      };
    case SHOW_WEEKDAY_OVERVIEW:
      return {
        ...state,
        showWeekdayOverview: action.val,
        showWeekOverview: false,
        showMonthOverview: false
      };
    case OPEN_MODAL:
      return {
        ...state,
        modalData: action.val && action.val.data,
        timeArray: action.val ? getExactTimes(action.val.data, action.val.arr) : []
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export const showBarChart = val => ({ type: SHOW_BAR_CHART, val });
export const showWeekOverview = val => ({ type: SHOW_WEEK_OVERVIEW, val });
export const showMonthOverview = val => ({ type: SHOW_MONTH_OVERVIEW, val });
export const showWeekdayOverview = val => ({ type: SHOW_WEEKDAY_OVERVIEW, val });
export const openModal = val => ({ type: OPEN_MODAL, val });
export const onReset = val => ({ type: RESET, val });
