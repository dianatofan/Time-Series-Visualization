import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import Card from '../widget/Card';
import Section from '../widget/Section';

import DayLabel from './DayLabel';
import BarChart from './BarChart';

import './BarChart.scss';
import {select} from "../../helpers/navigator";
import {saveColor, selectDay} from "../../reducers/calendar";
import {showBarChart} from "../../reducers/barChart";
import {setMonthInsights, setWeekdayInsights, setWeekInsights} from "../../reducers/app";

const Container = props => {
  const showBarChart = !!props.dayInsights[moment(props.selectedDay).format('YYYY-MM-DD')] ||
    !!props.weekInsights.length ||
    !!props.monthInsights.length ||
    !!props.weekdayInsights.length;

  const barChartProps = {
    plotData: props.plotData,
    margin: props.margin,
    height: props.height
  };

  return (
    <Section className='section-two-thirds'>
      <Card tabIndex={0} onKeyDown={ev =>
        (ev.key === 'ArrowLeft' && select(-1, props)) ||
        (ev.key === 'ArrowRight' && select(1, props))
      }>
        <DayLabel selectedDay={moment(props.selectedDay).format('YYYY-MM-DD')} />
        <div className='barChart'>
          {
            showBarChart
              ? <BarChart {...barChartProps} />
              : <div className='emptyString'>No data recorded</div>
          }
        </div>
      </Card>
    </Section>
  )
};

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  weekInsights: state.app.weekInsights,
  monthInsights: state.app.monthInsights,
  weekdayInsights: state.app.weekdayInsights,
  minDate: state.app.minDate,
  maxDate: state.app.maxDate,
  selectedDay: state.calendar.selectedDay,
  selectedWeek: state.app.selectedWeek,
  selectedMonth: state.app.selectedMonth,
  selectedWeekday: state.app.selectedWeekday,
  allDays: state.app.allDays,
  colors: state.calendar.colors,
  currentWeekdays: state.calendar.currentWeekdays,
  data: state.app.data
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  setWeekInsights: val => dispatch(setWeekInsights(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  saveColor: val => dispatch(saveColor(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
