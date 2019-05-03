import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import * as d3 from 'd3';
import {showBarChart} from '../../reducers/barChart';
import {selectDay, saveColor} from '../../reducers/calendar';
import {setMonthInsights, setWeekdayInsights} from '../../reducers/app';

class Day extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    const formatDate = date => moment(date).format('DD-MM-YY');
    const isCurrentWeek = (nextProps.currentWeek && nextProps.currentWeek.includes(moment(this.props.day).format('DD-MM-YYYY'))) ||
      (this.props.currentWeek && this.props.currentWeek.includes(moment(nextProps.day).format('DD-MM-YYYY')));
    const isCurrentMonth = (nextProps.currentMonth && nextProps.currentMonth.includes(moment(this.props.day).format('DD-MM-YYYY'))) ||
      (this.props.currentMonth && this.props.currentMonth.includes(moment(nextProps.day).format('DD-MM-YYYY')));
    const isCurrentWeekday = (nextProps.currentWeekdays && nextProps.currentWeekdays.daysArr.includes(moment(this.props.day).format('DD-MM-YYYY'))) ||
      (this.props.currentWeekdays && this.props.currentWeekdays.daysArr.includes(moment(nextProps.day).format('DD-MM-YYYY')));
    return formatDate(this.props.day) === formatDate(nextProps.selectedDay) ||
      formatDate(nextProps.day) === formatDate(this.props.selectedDay) ||
      this.props.fill !== nextProps.fill ||
      isCurrentWeek ||
      isCurrentMonth ||
      isCurrentWeekday ||
      this.props.cellSize !== nextProps.cellSize;
  }

  componentDidUpdate() {
    // d3.select('.day.fill')
    //   .transition()
    //   .duration(1000)
  }

  render() {
    const props = this.props;
    const cellMargin = props.cellMargin,
      cellSize = props.cellSize;
    const d = props.day;

    let isCurrentDay = false;
    if (moment(d).format('DD-MM-YY') === moment(props.selectedDay).format('DD-MM-YY')) {
      isCurrentDay = true;
    }

    const day = d => (d.getDay() + 6) % 7,
      week = d3.timeFormat('%W');

    const normalize = (val, max, min) => (1 - 0.25) * ((val - min) / (max - min)) + 0.25;

    const month = props.month;

    const days = d3.timeDays(month, new Date(month.getFullYear(), month.getMonth()+1, 1));
    let filters = days.map(d =>
      Object.keys(props.data).find(key =>
        new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0))
    );
    const count = filters.map(i => !!i && props.data[i]).filter(j => !!j);

    const isCurrentWeek = props.currentWeek && props.currentWeek.includes(moment(d).format('DD-MM-YYYY')) && props.showWeekOverview;
    const isCurrentMonth = (props.currentMonth && props.currentMonth.includes(moment(d).format('DD-MM-YYYY')) && props.showMonthOverview) ||
      (props.selectedMonth && props.selectedMonth === moment(d).format('M'));
    const isCurrentWeekday = (props.currentWeekdays && props.currentWeekdays.daysArr.includes(moment(d).format('DD-MM-YYYY')) && props.showWeekdayOverview) ||
      (props.selectedWeekday && props.selectedWeekday === moment(d).format('ddd'));

    const item = Object.keys(props.data).find(key =>
      new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0));
    const value = !!props.data[item] && normalize(props.data[item], Math.max(...count), Math.min(...count));
    const interpolateColor = (isCurrentWeek || isCurrentMonth || isCurrentWeekday)
      ? d3.interpolateOranges(value) : d3.interpolatePurples(value);
    let fillColor = !!props.data[item] ? (isCurrentDay ? d3.interpolateOranges(value) : interpolateColor) : '#ececec';

    const isColorSaved = this.props.colors.find(color => color.day === moment(d).format('DD-MM-YYYY'));
    value && !!props.data[item] && !isColorSaved && props.saveColor({ day: moment(d).format('DD-MM-YYYY'), value: d3.color(d3.interpolateOranges(value)) });

    const onDayClick = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      props.setMonthInsights({
        monthInsights: [],
        daysOfMonth: []
      });
      props.setWeekdayInsights({
        selectedWeekday: null,
        daysOfWeekday: [],
        weekdayInsights: []
      });
      props.selectDay({ day: d, color: d3.interpolateOranges(value) });
      props.showBarChart(true);
    };
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
        fill={fillColor}
        y={(day(d) * cellSize) + (day(d) * cellMargin) + cellMargin}
        x={((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin}
        onClick={onDayClick}
        data-tip={`${moment(d).format('dddd, DD MMM YYYY')}<br>Count: ${props.data[item] || 0}`}
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
