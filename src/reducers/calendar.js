import {getCurrentMonth, getCurrentWeek, getCurrentWeekdays} from "../helpers/parser";

const SHOW_CALENDAR = 'SHOW_CALENDAR';
const CHANGE_YEAR = 'CHANGE_YEAR';
const SCREEN_RESIZE = 'SCREEN_RESIZE';
const SELECT_DAY = 'SELECT_DAY';

const initialState = {
  isCalendarVisible: false,
  yearIndex: 0,
  cellSize: window.innerWidth / 125,
  cellMargin: window.innerWidth / 400,
  screenWidth: typeof window === 'object' ? window.innerWidth : null,
  selectedDay: null,
  currentWeek: null,
  currentMonth: null,
  currentWeekdays: null,
  color: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_CALENDAR:
      return {
        ...state,
        isCalendarVisible: action.val
      };
    case CHANGE_YEAR:
      return {
        ...state,
        yearIndex: state.yearIndex + action.val
      };
    case SCREEN_RESIZE:
      return Object.assign({}, state, {
        screenWidth: window.innerWidth,
        cellSize: window.innerWidth / 125,
        cellMargin: window.innerWidth / 400
      });
    case SELECT_DAY:
      return {
        ...state,
        selectedDay: action.val && action.val.day,
        color: action.val && action.val.color,
        currentWeek: getCurrentWeek(action.val),
        currentMonth: getCurrentMonth(action.val),
        currentWeekdays: getCurrentWeekdays(action.val)
      };
    default:
      return state;
  }
}

export const showCalendar = val => ({ type: SHOW_CALENDAR, val });
export const changeYear = val => ({ type: CHANGE_YEAR, val });
export const onScreenResize = val => ({ type: SCREEN_RESIZE, val });
export const selectDay = val => ({ type: SELECT_DAY, val });
