import parseData from '../helpers/parser';

const SET_DATA = 'SET_DATA';
const UPLOAD_FILE = 'UPLOAD_FILE';

const initialState = {
  data: [],
  rawData: [],
  files: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        data: parseData(action.val),
        rawData: action.val
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
