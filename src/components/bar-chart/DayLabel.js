import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import {showBarChart} from '../../reducers/barChart';
import {saveColor, selectDay} from '../../reducers/calendar';
import {setMonthInsights, setWeekdayInsights, setWeekInsights} from '../../reducers/app';
import {getMonthInsights, getWeekdayInsights, getWeekInsights} from '../../helpers/parser';
import * as d3 from 'd3';
import {getAdjacentDayColor} from "../../helpers/colors";

class DayLabel extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selectedDay !== this.props.selectedDay ||
      nextProps.selectedMonth !== this.props.selectedMonth ||
      nextProps.selectedWeek !== this.props.selectedWeek ||
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
    this.props.setWeekInsights({
      weekInsights: [],
      daysOfWeek: [],
      selectedWeek: null
    });
    const color = this.props.colors.find(color => color.day === moment(day).format('DD-MM-YYYY'));
    let value = color && d3.color(color.value);
    if (!value) {
      value = getAdjacentDayColor(this.props, moment(day).format('DD-MM-YYYY'), moment(day).startOf('month'));
      this.props.saveColor({ day: moment(day).format('DD-MM-YYYY'), value });
    }
    this.props.selectDay({ day, color: value, data: this.props.data });
    this.props.showBarChart(true);
  };

  pickWeek = week => {
    this.props.selectDay(null);
    this.props.setWeekdayInsights({
      selectedWeekday: null,
      daysOfWeekday: [],
      weekdayInsights: []
    });
    this.props.setMonthInsights({
      monthInsights: [],
      daysOfMonth: [],
      selectedMonth: null
    });
    const weekInsights = getWeekInsights(week, this.props.dayInsights, this.props.allDays);
    this.props.setWeekInsights({
      selectedWeek: weekInsights.selectedWeek,
      daysOfWeek: weekInsights.daysOfWeek,
      weekInsights: weekInsights.weekInsights
    });
    this.props.showBarChart(true);
  };

  pickMonth = month => {
    this.props.selectDay(null);
    this.props.setWeekdayInsights({
      selectedWeekday: null,
      daysOfWeekday: [],
      weekdayInsights: []
    });
    this.props.setWeekInsights({
      weekInsights: [],
      daysOfWeek: [],
      selectedWeek: null
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
    const weekdayInsights = getWeekdayInsights(weekday, this.props.dayInsights, this.props.allDays, this.props.currentWeekdays, this.props.data);
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
    } else if (this.props.selectedWeekday || this.props.selectedWeek) {
      return 'weeks';
    } else {
      return 'days';
    }
  };

  getString = selectedItem => {
    if (this.props.selectedMonth) {
      return moment(this.props.selectedMonth, 'M').format('MMMM');
    } else if (this.props.selectedWeek) {
      return `Week ${this.props.selectedWeek}`;
    } else if (this.props.selectedWeekday) {
      return `${moment(this.props.selectedWeekday, 'ddd').format('dddd')}s`;
    } else {
      return moment(selectedItem).format('dddd, MMMM DD YYYY');
    }
  };

  select = (selectedItem, val, unit) => {
    if (this.props.selectedDay) {
      this.pickDay(moment(selectedItem).add(val, unit));
    } else if (this.props.selectedWeek) {
      this.pickWeek(parseInt(this.props.selectedWeek) + val);
    } else if (this.props.selectedMonth) {
      this.pickMonth(parseInt(selectedItem) + val);
    } else if (this.props.selectedWeekday) {
      const isoWeekday = moment(selectedItem, 'ddd').isoWeekday();
      this.pickWeekday((moment(selectedItem, 'ddd').isoWeekday(isoWeekday + val)).format('ddd'));
    }
  };

  showArrows = (selectedItem, unit, minDate, maxDate) => {
    if (selectedItem) {
      const previousItem = moment(selectedItem).subtract(1, unit);
      const nextItem = moment(selectedItem).add(1, unit);
      const prev = previousItem.format(`${moment(minDate).year()}-MM-DD`);
      const min = minDate.startOf('year').format('YYYY-MM-DD');
      const next = nextItem.format(`${moment(maxDate).year()}-MM-DD`);
      const max = maxDate.startOf('year').format('YYYY-MM-DD');
      return {
        previous: moment(prev).isSameOrAfter(moment(min)),
        next: moment(next).isSameOrBefore(moment(max))
      }
    }
  };

  render() {
    const { minDate, maxDate, selectedMonth, selectedDay, selectedWeekday, selectedWeek } = this.props;
    const selectedItem = selectedMonth || selectedWeekday || selectedDay || selectedWeek;
    const unit = this.getUnit();

    const showArrows = this.showArrows(selectedItem, unit, minDate, maxDate);
    const showPreviousArrow = showArrows && showArrows.previous;
    const showNextArrow = showArrows && showArrows.next;

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
          onClick={() => showNextArrow && this.select(selectedItem, 1, unit)}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  minDate: state.app.minDate,
  maxDate: state.app.maxDate,
  selectedDay: state.calendar.selectedDay,
  selectedWeek: state.app.selectedWeek,
  selectedMonth: state.app.selectedMonth,
  selectedWeekday: state.app.selectedWeekday,
  dayInsights: state.app.dayInsights,
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

export default connect(mapStateToProps, mapDispatchToProps)(DayLabel);
