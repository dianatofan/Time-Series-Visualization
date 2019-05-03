import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import {showBarChart} from '../../reducers/barChart';
import {selectDay} from '../../reducers/calendar';
import {setMonthInsights, setWeekdayInsights} from '../../reducers/app';
import {getMonthInsights, getWeekdayInsights} from '../../helpers/parser';
import * as d3 from 'd3';

class DayLabel extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selectedDay !== this.props.selectedDay ||
      nextProps.selectedMonth !== this.props.selectedMonth ||
      nextProps.selectedWeekday !== this.props.selectedWeekday;
  }

  render() {
    const { minDate, maxDate, selectDay, showBarChart, setMonthInsights, setWeekdayInsights,
      selectedMonth, selectedDay, dayInsights, allDays, selectedWeekday, colors, currentWeekdays, dataArr } = this.props;
    const selectedItem = selectedMonth || selectedWeekday || selectedDay;
    let unit = '';
    if (selectedMonth) {
      unit = 'months';
    } else if (selectedWeekday) {
      unit = 'weeks';
    } else {
      unit = 'days';
    }
    const previousItem = selectedMonth ? selectedMonth-1 : moment(selectedItem).subtract(1, unit);
    const nextItem = selectedMonth ? parseInt(selectedMonth)+1 : moment(selectedItem).add(1, unit);
    const showPreviousArrow = selectedMonth ? moment(previousItem, 'M').isAfter(minDate.startOf('year')) : previousItem.isAfter(minDate.startOf('year'));
    const showNextArrow = selectedMonth ? true : nextItem.isBefore(maxDate.endOf('year'));
    const pickDay = day => {
      setMonthInsights({
        monthInsights: [],
        daysOfMonth: [],
        selectedMonth: null
      });
      setWeekdayInsights({
        selectedWeekday: null,
        daysOfWeekday: [],
        weekdayInsights: []
      });
      const color = colors.find(color => color.day === moment(day).format('DD-MM-YYYY'));
      const value = color && d3.color(color.value);
      selectDay({ day, color: value });
      showBarChart(true);
    };
    const pickMonth = month => {
      selectDay(null);
      setWeekdayInsights({
        selectedWeekday: null,
        daysOfWeekday: [],
        weekdayInsights: []
      });
      const monthInsights = getMonthInsights(month.toString(), dayInsights, allDays);
      setMonthInsights({
        selectedMonth: monthInsights.selectedMonth,
        daysOfMonth: monthInsights.daysOfMonth,
        monthInsights: monthInsights.monthInsights
      });
      showBarChart(true);
    };
    const pickWeekday = weekday => {
      selectDay(null);
      setMonthInsights({
        monthInsights: [],
        daysOfMonth: [],
        selectedMonth: null
      });
      const weekdayInsights = getWeekdayInsights(weekday, dayInsights, allDays, currentWeekdays, dataArr);
      setWeekdayInsights({
        weekdayInsights: weekdayInsights.weekdayInsights,
        daysOfWeekday: weekdayInsights.daysOfWeekday,
        selectedWeekday: weekdayInsights.selectedWeekday
      });
      showBarChart(true);
    };
    let string = '';
    if (selectedMonth) {
      string = moment(selectedMonth, 'M').format('MMMM');
    } else if (selectedWeekday) {
      string = `${moment(selectedWeekday, 'ddd').format('dddd')}s`;
    } else {
      string = moment(selectedItem).format('dddd, MMMM DD YYYY');
    }

    return (
      <div className='year-label dayTitle'
           tabIndex={0}
           onKeyDown={ev => {
             if (ev) {
               if (ev.key === 'ArrowLeft') {
                 if (selectedDay) {
                   pickDay(moment(selectedItem).add(-1, unit));
                 } else if (selectedMonth) {
                   pickMonth(parseInt(selectedItem) - 1);
                 } else if (selectedWeekday) {
                   const isoWeekday = moment(selectedItem, 'ddd').isoWeekday();
                   pickWeekday((moment(selectedItem, 'ddd').isoWeekday(isoWeekday - 1)).format('ddd'));
                 }
               }
               if (ev.key === 'ArrowRight') {
                 if (selectedDay) {
                   pickDay(moment(selectedItem).add(1, unit));
                 } else if (selectedMonth) {
                   pickMonth(parseInt(selectedItem) + 1);
                 } else if (selectedWeekday) {
                   const isoWeekday = moment(selectedItem, 'ddd').isoWeekday();
                   pickWeekday((moment(selectedItem, 'ddd').isoWeekday(isoWeekday + 1)).format('ddd'));
                 }
               }
             }
      }}>
        <i
          className={classNames('fas fa-chevron-left', {'disabled': !showPreviousArrow})}
          onClick={() => {
            if (showPreviousArrow) {
              if (selectedDay) {
                pickDay(moment(selectedItem).add(-1, unit));
              } else if (selectedMonth) {
                pickMonth(parseInt(selectedItem) - 1);
              } else if (selectedWeekday) {
                const isoWeekday = moment(selectedItem, 'ddd').isoWeekday();
                pickWeekday((moment(selectedItem, 'ddd').isoWeekday(isoWeekday - 1)).format('ddd'));
              }
            }}
          }
        />
        { string }
        <i
          className={classNames('fas fa-chevron-right', {'disabled': !showNextArrow})}
          onClick={() => {
            if (showPreviousArrow) {
              if (selectedDay) {
                pickDay(moment(selectedItem).add(+1, unit));
              } else if (selectedMonth) {
                pickMonth(parseInt(selectedItem) + 1);
              } else if (selectedWeekday) {
                const isoWeekday = moment(selectedItem, 'ddd').isoWeekday();
                pickWeekday((moment(selectedItem, 'ddd').isoWeekday(isoWeekday + 1)).format('ddd'));
              }
            }}
          }
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  minDate: state.app.minDate,
  maxDate: state.app.maxDate,
  selectedDay: state.calendar.selectedDay,
  selectedMonth: state.app.selectedMonth,
  selectedWeekday: state.app.selectedWeekday,
  dayInsights: state.app.dayInsights,
  allDays: state.app.allDays,
  colors: state.calendar.colors,
  currentWeekdays: state.calendar.currentWeekdays,
  dataArr: state.app.data
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(DayLabel);
