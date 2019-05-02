import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Dropdown from 'react-dropdown';
import * as d3 from 'd3';

import { setData, setDatasetName, showSpinner, setMonthInsights, setWeekdayInsights } from '../reducers/app';
import { showCalendar, selectDay } from '../reducers/calendar';
import { showBarChart, showWeekOverview, showMonthOverview, showWeekdayOverview } from '../reducers/barChart';

import Heatmap from './calendar/Heatmap';
import Container from './bar-chart/Container';
import DragAndDrop from './widget/DragAndDrop';
import Section from './widget/Section';

import 'react-dropdown/style.css';
import './App.scss';
import './Spinner.scss';

import dataset1 from '../data/itching_in_nose_tbc.csv';
import dataset2 from '../data/itch_tbc.csv';
import dataset3 from '../data/ptsd_filtered.csv';
import dataset4 from '../data/data.csv';

import { whyDidYouUpdate } from 'why-did-you-update';

const App = props => {
  const options = ['Dataset_1.csv', 'Dataset_2.csv', 'Dataset_3.csv', 'Dataset_4.csv'];
  const renderHeatmap = dataset => {
    d3.csv(dataset).then(data => {
      props.setData(data);
      props.showCalendar(true);
    }).catch(err => {
      throw err;
    });
  };
  const removeCharts = () => {
    props.showBarChart(false);
    props.showCalendar(false);
    props.setMonthInsights({
      monthInsights: [],
      daysOfMonth: []
    });
    props.setWeekdayInsights({
      selectedWeekday: null,
      daysOfWeekday: [],
      weekdayInsights: []
    });
    props.selectDay(null);
    props.showWeekOverview(false);
    props.showMonthOverview(false);
    props.showWeekdayOverview(false);
  };
  const onSelect = item => {
    removeCharts();
    const value = item.value;
    props.setDatasetName(value);
    props.showSpinner(true);
    if (value === 'Dataset_1.csv') {
      renderHeatmap(dataset1);
    }
    if (value === 'Dataset_2.csv') {
      renderHeatmap(dataset2);
    }
    if (value === 'Dataset_3.csv') {
      renderHeatmap(dataset3);
    }
    if (value === 'Dataset_4.csv') {
      renderHeatmap(dataset4);
    }
  };

  const showDropzone = true;

  // whyDidYouUpdate(React);

  const renderBarChart = () =>
    <Container
      data={props.allDays[props.selectedDay]}
      margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
      height={300}
      paddingInner={0.2}
      paddingOuter={0.1}
    />;

  const renderSpinner = () =>
    <div className='spinner'>
      <div className='double-bounce1' />
      <div className='double-bounce2' />
    </div>;

  return (
    <div className='app'>
      <header className='header'>
        <div className='title'> Visualizing Time-Series Data </div>
      </header>
      <div className='content'>
        { showDropzone && <DragAndDrop /> }
        <Section title='Select dataset'>
          <Dropdown
            className='dropdown'
            options={options}
            placeholder='Choose...'
            value={props.datasetName}
            onChange={onSelect}
          />
        </Section>
        { props.isCalendarVisible && <Heatmap /> }
        { props.isBarChartVisible && renderBarChart() }
        { props.isSpinnerVisible && renderSpinner() }
      </div>
    </div>
  )
};

const mapStateToProps = state => ({
  allDays: state.app.allDays,
  data: state.app.data,
  datasetName: state.app.datasetName,
  dayInsights: state.app.dayInsights,
  selectedDay: moment(state.calendar.selectedDay).format('YYYY-MM-DD'),
  isCalendarVisible: state.calendar.isCalendarVisible,
  isBarChartVisible: state.barChart.isBarChartVisible,
  isEmptyContainerVisible: state.app.isEmptyContainerVisible,
  isSpinnerVisible: state.app.isSpinnerVisible
});

const mapDispatchToProps = dispatch => ({
  showCalendar: val => dispatch(showCalendar(val)),
  setData: val => dispatch(setData(val)),
  setDatasetName: val => dispatch(setDatasetName(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  showSpinner: val => dispatch(showSpinner(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  selectDay: val => dispatch(selectDay(val)),
  showWeekOverview: val => dispatch(showWeekOverview(val)),
  showMonthOverview: val => dispatch(showMonthOverview(val)),
  showWeekdayOverview: val => dispatch(showWeekdayOverview(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
