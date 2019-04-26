import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';

import { setWeekdayInsights, setMonthInsights } from '../../reducers/app';
import { selectDay, showBarChart } from '../../reducers/barChart';
import { getWeekdayInsights } from '../../helpers/parser';

const weekArray = Array.apply(null, Array(7)).map(function (_, i) {
  return moment(i, 'e').startOf('week').isoWeekday(i+1).format('ddd');
});

const DayLabels = props => {
  const onWeekdayClick = day => {
    props.selectDay(null);
    props.setMonthInsights({
      monthInsights: [],
      daysOfMonth: []
    });
    const weekdayInsights = getWeekdayInsights(day, props.dayInsights, props.allDays);
    props.setWeekdayInsights({
      selectedWeekday: weekdayInsights.selectedWeekday,
      daysOfWeekday: weekdayInsights.daysOfWeekday,
      weekdayInsights: weekdayInsights.weekdayInsights
    });
    props.showBarChart(true);
  };
  return (
    <div className='day-labels-container'>
    {
      weekArray.map(day =>
        <text
          key={day}
          className={classNames('day-labels', {'bold': props.selectedWeekday === day})}
          onClick={() => onWeekdayClick(day)}
        >
          {day}
        </text>
      )
    }
    </div>
  );
};

const mapStateToProps = state => ({
  allDays: state.app.allDays,
  dayInsights: state.app.dayInsights,
  selectedWeekday: state.app.selectedWeekday
});

const mapDispatchToProps = dispatch => ({
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  selectDay: val => dispatch(selectDay(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(DayLabels);
