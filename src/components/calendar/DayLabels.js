import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import {setWeekdayInsights, setMonthInsights} from "../../reducers/app";
import {selectDay, showBarChart} from "../../reducers/barChart";
import {getMonthInsights, getWeekdayInsights} from "../../helpers/parser";
import {connect} from "react-redux";

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
    <div className='dayLabelsContainer'>
    <span>
      {
        weekArray.map(day =>
          <text
            key={day}
            className={classNames('dayLabels', {'bold': props.selectedWeekday === day})}
            onClick={() => onWeekdayClick(day)}
          >
            {day}
          </text>
        )
      }
    </span>
    </div>
  );
};

const mapStateToProps = state => ({
  allDays: state.app.allDays,
  data: state.app.data,
  dayInsights: state.app.dayInsights,
  cellSize: state.calendar.cellSize,
  cellMargin: state.calendar.cellMargin,
  selectedWeekday: state.app.selectedWeekday
});

const mapDispatchToProps = dispatch => ({
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  selectDay: val => dispatch(selectDay(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(DayLabels);
