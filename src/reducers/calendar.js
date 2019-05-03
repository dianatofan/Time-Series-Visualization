import {getCurrentMonth, getCurrentWeek, getCurrentWeekdays} from "../helpers/parser";

const SHOW_CALENDAR = 'SHOW_CALENDAR';
const CHANGE_YEAR = 'CHANGE_YEAR';
const SCREEN_RESIZE = 'SCREEN_RESIZE';
const SELECT_DAY = 'SELECT_DAY';
const SAVE_COLOR = 'SAVE_COLOR';

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
  color: null,
  colors: []
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
      const selectedDay = action.val && action.val.day;
      const color = action.val && action.val.color;
      return {
        ...state,
        selectedDay,
        color,
        currentWeek: getCurrentWeek(selectedDay),
        currentMonth: getCurrentMonth(selectedDay),
        currentWeekdays: getCurrentWeekdays(selectedDay)
      };
    case SAVE_COLOR:
      return Object.assign({}, state, {
        colors: [...new Set(state.colors.concat({
            day: action.val.day,
            value: action.val.value
        }))]
      });
    default:
      return state;
  }
}

export const showCalendar = val => ({ type: SHOW_CALENDAR, val });
export const changeYear = val => ({ type: CHANGE_YEAR, val });
export const onScreenResize = val => ({ type: SCREEN_RESIZE, val });
export const selectDay = val => ({ type: SELECT_DAY, val });
export const saveColor = val => ({ type: SAVE_COLOR, val });
