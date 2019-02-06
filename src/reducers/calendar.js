const SHOW_CALENDAR = 'SHOW_CALENDAR';
const SHOW_TOOLTIP = 'SHOW_TOOLTIP';
const CHANGE_YEAR = 'CHANGE_YEAR';

const initialState = {
  isCalendarVisible: false,
  showTooltip: false,
  yearIndex: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_CALENDAR:
      return {
        ...state,
        isCalendarVisible: action.val
      };
    case SHOW_TOOLTIP:
      return {
        ...state,
        showTooltip: action.val
      };
    case CHANGE_YEAR:
      return {
        ...state,
        currentYear: parseInt(state.currentYear) + action.val,
        yearIndex: state.yearIndex + action.val
      };
    default:
      return state;
  }
}

export const showCalendar = val => ({ type: SHOW_CALENDAR, val });
export const showTooltip = val => ({ type: SHOW_TOOLTIP, val });
