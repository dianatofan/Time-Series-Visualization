import parseData, { getDayInsights } from '../helpers/parser';
import moment from 'moment';

const SET_DATA = 'SET_DATA';
const UPLOAD_FILE = 'UPLOAD_FILE';

const initialState = {
  data: [],
  minDate: null,
  maxDate: null,
  dayInsights: [],
  files: [],
  showTooltip: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      const data = parseData(action.val);
      const moments = Object.keys(data).map(d => moment(d));
      return {
        ...state,
        data,
        dayInsights: getDayInsights(action.val),
        minDate: moment.min(moments),
        maxDate: moment.max(moments)
      };
    case UPLOAD_FILE:
      return {
        ...state,
        files: action.val
      };
    default:
      return state;
  }
}

export const setData = val => ({ type: SET_DATA, val });
export const uploadFile = val => ({ type: UPLOAD_FILE, val });
