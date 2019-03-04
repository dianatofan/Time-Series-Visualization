const SHOW_BAR_CHART = 'SHOW_BAR_CHART';
const SELECT_DAY = 'SELECT_DAY';

const initialState = {
  isBarChartVisible: false,
  selectedDay: null,
  dayInsights: []
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
        selectedDay: action.val
      };
    default:
      return state;
  }
}

export const showBarChart = val => ({ type: SHOW_BAR_CHART, val });
export const selectDay = val => ({ type: SELECT_DAY, val });
