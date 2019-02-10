const SHOW_CALENDAR = 'SHOW_CALENDAR';
const CHANGE_YEAR = 'CHANGE_YEAR';

const initialState = {
  isCalendarVisible: false,
  yearIndex: 0,
  cellSize: window.innerWidth / 125,
  cellMargin: window.innerWidth / 400
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
    default:
      return state;
  }
}

export const showCalendar = val => ({ type: SHOW_CALENDAR, val });
export const changeYear = val => ({ type: CHANGE_YEAR, val });
