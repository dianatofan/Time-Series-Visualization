import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import * as d3 from 'd3';
import {showBarChart} from '../../reducers/barChart';
import {selectDay, saveColor} from '../../reducers/calendar';
import {
  onShiftClick, removeItem,
  resetShiftSelection,
  setMonthInsights,
  setWeekdayInsights,
  setWeekInsights
} from '../../reducers/app';
import {getAdjacentDayColor, getDayColor, getColors} from '../../helpers/colors';

class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const formatDate = date => moment(date).format('DD-MM-YY');
    return formatDate(this.props.day) === formatDate(nextProps.selectedDay) ||
      formatDate(nextProps.day) === formatDate(this.props.selectedDay) ||
      this.props.selectedWeek !== nextProps.selectedWeek ||
      this.isEqual(nextProps) ||
      this.props.fill !== nextProps.fill ||
      this.props.shiftSelection !== nextProps.shiftSelection ||
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

  onDayClick = (ev, day, color) => {
    console.log(this.refs.day.getBoundingClientRect())
    ev.stopPropagation();
    const formattedDay = moment(day).format('YYYY-MM-DD');
    if (ev.shiftKey) {
      this.setState({
        toggle: !this.state.toggle
      });
      this.state.toggle ? this.props.onShiftClick(formattedDay) : this.props.removeItem(formattedDay);
    } else {
      this.props.setMonthInsights({
        selectedMonth: null,
        monthInsights: [],
        daysOfMonth: []
      });
      this.props.setWeekdayInsights({
        selectedWeekday: null,
        daysOfWeekday: [],
        weekdayInsights: []
      });
      this.props.setWeekInsights({
        selectedWeek: null,
        daysOfWeek: [],
        weekInsights: []
      });
      this.props.resetShiftSelection();
      const color = d3.color(getColors(this.props.data).oranges(this.props.data[formattedDay]));
      this.props.selectDay({ day, color, data: this.props.data });
      this.props.showBarChart(true);
      const previousDay = moment(day).subtract(1, 'd').format('DD-MM-YYYY');
      const nextDay = moment(day).add(1, 'd').format('DD-MM-YYYY');
      const isColorSaved = this.props.colors.find(color => color.day === moment(day).format('DD-MM-YYYY'));
      const isPreviousColorSaved = this.props.colors.find(color => color.day === previousDay);
      const isNextColorSaved = this.props.colors.find(color => color.day === nextDay);
      !isColorSaved && this.props.saveColor({ day: moment(day).format('DD-MM-YYYY'), value: color });
      !isPreviousColorSaved && this.props.saveColor({ day: previousDay, value: getAdjacentDayColor(this.props, previousDay) });
      !isNextColorSaved && this.props.saveColor({ day: nextDay, value: getAdjacentDayColor(this.props, nextDay) });
    }
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

    const isSelected = !!props.shiftSelection.length &&
      (moment(d).format('M') === props.selectedMonth ||
        moment(d).isoWeek() === props.selectedWeek ||
        moment(d).format('ddd') === props.selectedWeekday ||
        moment(d).format('DD-MM-YY') === moment(props.selectedDay).format('DD-MM-YY'));

    const showStroke = isCurrentDay || (isSelected && props.data[moment(d).format('YYYY-MM-DD')]);

    return (
      <rect
        data-tip={`${moment(d).format('dddd, DD MMM YYYY')}<br>Count: ${color.count}`}
        data-for='svgTooltip'
        ref='day'
        key={d}
        className='day fade-in'
        stroke={showStroke ? '#000' : ''}
        strokeWidth={showStroke ? 1 : 0}
        width={cellSize}
        height={cellSize}
        rx={50}
        ry={50}
        fill={color.fillColor}
        y={(day(d) * cellSize) + (day(d) * cellMargin) + cellMargin + 20}
        x={((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin}
        onClick={ev => this.onDayClick(ev, d, color)}
      >
      </rect>
    )
  }
}

const mapStateToProps = state => ({
  data: state.app.data,
  selectedDay: state.calendar.selectedDay,
  selectedMonth: state.app.selectedMonth,
  selectedWeek: state.app.selectedWeek,
  selectedWeekday: state.app.selectedWeekday,
  shiftSelection: state.app.shiftSelection,
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
  setWeekInsights: val => dispatch(setWeekInsights(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  saveColor: val => dispatch(saveColor(val)),
  onShiftClick: val => dispatch(onShiftClick(val)),
  resetShiftSelection: val => dispatch(resetShiftSelection(val)),
  removeItem: val => dispatch(removeItem(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Day);
