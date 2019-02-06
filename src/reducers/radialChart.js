const SHOW_RADIAL_CHART = 'SHOW_RADIAL_CHART';
const SELECT_DAY = 'SELECT_DAY';

const initialState = {
  isRadialChartVisible: false,
  selectedDay: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_RADIAL_CHART:
      return {
        ...state,
        isRadialChartVisible: action.val
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

export const showRadialChart = val => ({ type: SHOW_RADIAL_CHART, val });
export const selectDay = val => ({ type: SELECT_DAY, val });
