import { combineReducers } from 'redux';
import app from './app';
import calendar from './calendar';
import radialChart from './radialChart';
import barChart from './barChart';

const rootReducer = combineReducers({
  app,
  calendar,
  radialChart,
  barChart
});

export default rootReducer;
