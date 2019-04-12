import parseData, { getDayInsights, parseDayInsights } from '../helpers/parser';
import moment from 'moment';

const SET_DATA = 'SET_DATA';
const UPLOAD_FILE = 'UPLOAD_FILE';
const SET_DATASET_NAME = 'SET_DATASET_NAME';
const SHOW_SPINNER = 'SHOW_SPINNER';
const SET_MONTH_INSIGHTS = 'SET_MONTH_INSIGHTS';
const SET_WEEKDAY_INSIGHTS = 'SET_WEEKDAY_INSIGHTS';

const initialState = {
  data: [],
  rawData: [],
  minDate: null,
  maxDate: null,
  dayInsights: [],
  monthInsights: [],
  daysOfMonth: [],
  selectedMonth: null,
  weekdayInsights: [],
  daysOfWeekday: [],
  selectedWeekday: null,
  datasetName: '',
  files: [],
  allDays: [],
  showTooltip: false,
  isSpinnerVisible: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      const data = parseData(action.val);
      const moments = Object.keys(data).map(d => moment(d));
      return {
        ...state,
        rawData: action.val,
        data,
        dayInsights: getDayInsights(action.val),
        minDate: moment.min(moments),
        maxDate: moment.max(moments),
        allDays: parseDayInsights(action.val)
      };
    case UPLOAD_FILE:
      return {
        ...state,
        files: action.val
      };
    case SET_DATASET_NAME:
      return {
        ...state,
        datasetName: action.val
      };
    case SHOW_SPINNER:
      return {
        ...state,
        isSpinnerVisible: action.val
      };
    case SET_MONTH_INSIGHTS:
      return {
        ...state,
        monthInsights: action.val.monthInsights,
        daysOfMonth: action.val.daysOfMonth,
        selectedMonth: action.val.selectedMonth
      };
    case SET_WEEKDAY_INSIGHTS:
      return {
        ...state,
        weekdayInsights: action.val.weekdayInsights,
        daysOfWeekday: action.val.daysOfWeekday,
        selectedWeekday: action.val.selectedWeekday
      };
    default:
      return state;
  }
}

export const setData = val => ({ type: SET_DATA, val });
export const uploadFile = val => ({ type: UPLOAD_FILE, val });
export const setDatasetName = val => ({ type: SET_DATASET_NAME, val });
export const showSpinner = val => ({ type: SHOW_SPINNER, val });
export const setMonthInsights = val => ({ type: SET_MONTH_INSIGHTS, val });
export const setWeekdayInsights = val => ({ type: SET_WEEKDAY_INSIGHTS, val });
