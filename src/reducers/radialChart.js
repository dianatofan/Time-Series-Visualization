const SHOW_RADIAL_CHART = 'SHOW_RADIAL_CHART';
const HIGHLIGHT_DAY = 'HIGHLIGHT_DAY';

const initialState = {
  isRadialChartVisible: false,
  highlightedWeekday: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_RADIAL_CHART:
      return {
        ...state,
        isRadialChartVisible: action.val
      };
    case HIGHLIGHT_DAY:
      return {
        ...state,
        highlightedWeekday: action.val
      };
    default:
      return state;
  }
}

export const showRadialChart = val => ({ type: SHOW_RADIAL_CHART, val });
export const highlightDay = val => ({ type: HIGHLIGHT_DAY, val });
