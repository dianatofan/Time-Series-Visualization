import parseData, { getDayInsights } from '../helpers/parser';
import moment from 'moment';

const SET_DATA = 'SET_DATA';
const UPLOAD_FILE = 'UPLOAD_FILE';
const SET_DATASET_NAME = 'SET_DATASET_NAME';
const SHOW_SPINNER = 'SHOW_SPINNER';
const SHOW_EMPTY_CONTAINER = 'SHOW_EMPTY_CONTAINER';

const initialState = {
  data: [],
  minDate: null,
  maxDate: null,
  dayInsights: [],
  datasetName: '',
  files: [],
  showTooltip: false,
  isSpinnerVisible: false,
  isEmptyContainerVisible: false
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
    case SHOW_EMPTY_CONTAINER:
      return {
        ...state,
        isEmptyContainerVisible: action.val
      };
    default:
      return state;
  }
}

export const setData = val => ({ type: SET_DATA, val });
export const uploadFile = val => ({ type: UPLOAD_FILE, val });
export const setDatasetName = val => ({ type: SET_DATASET_NAME, val });
export const showSpinner = val => ({ type: SHOW_SPINNER, val });
export const showEmptyContainer = val => ({ type: SHOW_EMPTY_CONTAINER, val });
