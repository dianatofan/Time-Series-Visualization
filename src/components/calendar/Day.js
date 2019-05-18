import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import * as d3 from 'd3';
import {showBarChart} from '../../reducers/barChart';
import {selectDay, saveColor} from '../../reducers/calendar';
import {setMonthInsights, setWeekdayInsights} from '../../reducers/app';
import {getDayColor} from '../../helpers/colors';

class Day extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    const formatDate = date => moment(date).format('DD-MM-YY');
    return formatDate(this.props.day) === formatDate(nextProps.selectedDay) ||
      formatDate(nextProps.day) === formatDate(this.props.selectedDay) ||
      this.isEqual(nextProps) ||
      this.props.fill !== nextProps.fill ||
      this.props.cellSize !== nextProps.cellSize;
  }

  isEqual = nextProps => {
    const isCurrentWeek = (nextProps.currentWeek && nextProps.currentWeek.includes(moment(this.props.day).format('DD-MM-YYYY'))) ||
      (this.props.currentWeek && this.props.currentWeek.includes(moment(nextProps.day).format('DD-MM-YYYY')));
    const isCurrentMonth = (nextProps.currentMonth && nextProps.currentMonth.includes(moment(this.props.day).format('DD-MM-YYYY'))) ||
      (this.props.currentMonth && this.props.currentMonth.includes(moment(nextProps.day).format('DD-MM-YYYY')));
    const isCurrentWeekday = (nextProps.currentWeekdays && nextProps.currentWeekdays.daysArr.includes(moment(this.props.day).format('DD-MM-YYYY'))) ||
      (this.props.currentWeekdays && this.props.currentWeekdays.daysArr.includes(moment(nextProps.day).format('DD-MM-YYYY')));
    return isCurrentWeek || isCurrentMonth || isCurrentWeekday;
  };

  componentDidUpdate() {
    // d3.select('.day.fill')
    //   .transition()
    //   .duration(1000)
  }

  onDayClick = (ev, day, color) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.setMonthInsights({
      monthInsights: [],
      daysOfMonth: []
    });
    this.props.setWeekdayInsights({
      selectedWeekday: null,
      daysOfWeekday: [],
      weekdayInsights: []
    });
    this.props.selectDay({ day, color: d3.interpolateOranges(color.value) });
    this.props.showBarChart(true);
  };

  render() {
    const props = this.props;
    const { cellMargin, cellSize } = this.props;
    const d = props.day;

    let isCurrentDay = false;
    if (moment(d).format('DD-MM-YY') === moment(props.selectedDay).format('DD-MM-YY')) {
      isCurrentDay = true;
    }
    const day = d => (d.getDay() + 6) % 7,
      week = d3.timeFormat('%W');

    const color = getDayColor(props, isCurrentDay);

    return (
      <rect
        key={d}
        className='day'
        stroke={isCurrentDay ? '#000' : ''}
        strokeWidth={isCurrentDay ? 1 : 0}
        width={cellSize}
        height={cellSize}
        rx={50}
        ry={50}
        fill={color.fillColor}
        y={(day(d) * cellSize) + (day(d) * cellMargin) + cellMargin}
        x={((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin}
        onClick={ev => this.onDayClick(ev, d, color)}
        data-tip={`${moment(d).format('dddd, DD MMM YYYY')}<br>Count: ${color.count}`}
        data-for='svgTooltip'
      >
      </rect>
    )
  }
}

const mapStateToProps = state => ({
  data: state.app.data,
  selectedDay: state.calendar.selectedDay,
  selectedWeekday: state.app.selectedWeekday,
  selectedMonth: state.app.selectedMonth,
  showWeekOverview: state.barChart.showWeekOverview,
  showMonthOverview: state.barChart.showMonthOverview,
  showWeekdayOverview: state.barChart.showWeekdayOverview,
  currentWeek: state.calendar.currentWeek,
  currentMonth: state.calendar.currentMonth,
  currentWeekdays: state.calendar.currentWeekdays,
  dayInsights: state.app.dayInsights,
  cellSize: state.calendar.cellSize,
  cellMargin: state.calendar.cellMargin,
  allDays: state.app.allDays,
  colors: state.calendar.colors
});

const mapDispatchToProps = dispatch => ({
  showBarChart: val => dispatch(showBarChart(val)),
  selectDay: val => dispatch(selectDay(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  saveColor: val => dispatch(saveColor(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Day);
