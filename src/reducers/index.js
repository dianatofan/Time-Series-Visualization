import { combineReducers } from 'redux';
import app from './app';
import calendar from './calendar';
import radialChart from './radialChart';

const rootReducer = combineReducers({
  app,
  calendar,
  radialChart
});

export default rootReducer;
