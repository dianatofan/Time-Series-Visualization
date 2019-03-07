const SHOW_CALENDAR = 'SHOW_CALENDAR';
const CHANGE_YEAR = 'CHANGE_YEAR';
const SCREEN_RESIZE = 'SCREEN_RESIZE';

const initialState = {
  isCalendarVisible: false,
  yearIndex: 0,
  cellSize: window.innerWidth / 125,
  cellMargin: window.innerWidth / 400,
  screenWidth: typeof window === 'object' ? window.innerWidth : null
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
        screenWidth: action.screenWidth
      });
    default:
      return state;
  }
}

export const showCalendar = val => ({ type: SHOW_CALENDAR, val });
export const changeYear = val => ({ type: CHANGE_YEAR, val });
export const onScreenResize = val => ({ type: SCREEN_RESIZE, val });
