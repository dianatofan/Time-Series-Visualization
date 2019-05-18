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

  pickDay = day => {
    this.props.setMonthInsights({
      monthInsights: [],
      daysOfMonth: [],
      selectedMonth: null
    });
    this.props.setWeekdayInsights({
      selectedWeekday: null,
      daysOfWeekday: [],
      weekdayInsights: []
    });
    const color = this.props.colors.find(color => color.day === moment(day).format('DD-MM-YYYY'));
    const value = color && d3.color(color.value);
    this.props.selectDay({ day, color: value });
    this.props.showBarChart(true);
  };

  pickMonth = month => {
    this.props.selectDay(null);
    this.props.setWeekdayInsights({
      selectedWeekday: null,
      daysOfWeekday: [],
      weekdayInsights: []
    });
    const monthInsights = getMonthInsights(month.toString(), this.props.dayInsights, this.props.allDays);
    this.props.setMonthInsights({
      selectedMonth: monthInsights.selectedMonth,
      daysOfMonth: monthInsights.daysOfMonth,
      monthInsights: monthInsights.monthInsights
    });
    this.props.showBarChart(true);
  };

  pickWeekday = weekday => {
    this.props.selectDay(null);
    this.props.setMonthInsights({
      monthInsights: [],
      daysOfMonth: [],
      selectedMonth: null
    });
    const weekdayInsights = getWeekdayInsights(weekday, this.props.dayInsights, this.props.allDays, this.props.currentWeekdays, this.props.dataArr);
    this.props.setWeekdayInsights({
      weekdayInsights: weekdayInsights.weekdayInsights,
      daysOfWeekday: weekdayInsights.daysOfWeekday,
      selectedWeekday: weekdayInsights.selectedWeekday
    });
    this.props.showBarChart(true);
  };

  getUnit = () => {
    if (this.props.selectedMonth) {
      return 'months';
    } else if (this.props.selectedWeekday) {
      return 'weeks';
    } else {
      return 'days';
    }
  };

  getString = selectedItem => {
    if (this.props.selectedMonth) {
      return moment(this.props.selectedMonth, 'M').format('MMMM');
    } else if (this.props.selectedWeekday) {
      return `${moment(this.props.selectedWeekday, 'ddd').format('dddd')}s`;
    } else {
      return moment(selectedItem).format('dddd, MMMM DD YYYY');
    }
  };

  select = (selectedItem, val, unit) => {
    if (this.props.selectedDay) {
      this.pickDay(moment(selectedItem).add(val, unit));
    } else if (this.props.selectedMonth) {
      this.pickMonth(parseInt(selectedItem) + val);
    } else if (this.props.selectedWeekday) {
      const isoWeekday = moment(selectedItem, 'ddd').isoWeekday();
      this.pickWeekday((moment(selectedItem, 'ddd').isoWeekday(isoWeekday + val)).format('ddd'));
    }
  };

  render() {
    const { minDate, maxDate, selectedMonth, selectedDay, selectedWeekday } = this.props;
    const selectedItem = selectedMonth || selectedWeekday || selectedDay;
    const unit = this.getUnit();

    const previousItem = selectedMonth ? selectedMonth-1 : moment(selectedItem).subtract(1, unit);
    const nextItem = selectedMonth ? parseInt(selectedMonth)+1 : moment(selectedItem).add(1, unit);

    const showPreviousArrow = selectedMonth ? moment(previousItem, 'M').isAfter(minDate.startOf('year')) : previousItem.isAfter(minDate.startOf('year'));
    const showNextArrow = selectedMonth ? true : nextItem.isBefore(maxDate.endOf('year'));

    return (
      <div className='year-label dayTitle'
           tabIndex={0}
           onKeyDown={ev =>
             (ev.key === 'ArrowLeft' && this.select(selectedItem, -1, unit)) ||
             (ev.key === 'ArrowRight' && this.select(selectedItem, 1, unit))
           }>
        <i
          className={classNames('fas fa-chevron-left', {'disabled': !showPreviousArrow})}
          onClick={() => showPreviousArrow && this.select(selectedItem, -1, unit)}
        />
        { this.getString(selectedItem) }
        <i
          className={classNames('fas fa-chevron-right', {'disabled': !showNextArrow})}
          onClick={() => showPreviousArrow && this.select(selectedItem, 1, unit)}
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
