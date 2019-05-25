import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';

import { setWeekdayInsights, setMonthInsights } from '../../reducers/app';
import { showBarChart } from '../../reducers/barChart';
import { selectDay } from '../../reducers/calendar';
import { getWeekdayInsights } from '../../helpers/parser';

const weekArray = Array.apply(null, Array(7)).map(function (_, i) {
  return moment(i, 'e').startOf('week').isoWeekday(i+1).format('ddd');
});

const WeekLabels = props => {
  const nrOfWeeks = props.maxDate.endOf('year').diff(props.minDate.startOf('year'), 'week');
  const weeks = Array.from({ length: nrOfWeeks }, (v, k) => k+1);
  return (
    <div className='week-labels-container'>
      {
        weeks.map(week =>
          <text
            className='week'
            key={week}
          >
            {week}
          </text>
        )
      }
    </div>
  );
};

const mapStateToProps = state => ({
  minDate: state.app.minDate,
  maxDate: state.app.maxDate
});

const mapDispatchToProps = dispatch => ({
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  selectDay: val => dispatch(selectDay(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(WeekLabels);
