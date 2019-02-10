import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import * as d3 from 'd3';
import { selectDay, showRadialChart } from '../../reducers/radialChart';

const Day = props => {
  const cellMargin = props.cellMargin,
    cellSize = props.cellSize;
  const d = props.day;

  let isCurrentDay = false;
  if (moment(d).format('DD-MM-YY') === moment().format('DD-MM-YY')) {
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

  const item = Object.keys(props.data).find(key =>
    new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0));
  const value = !!props.data[item] && normalize(props.data[item], Math.max(...count), Math.min(...count));
  const fillColor = !!props.data[item] ? d3.interpolatePurples(value) : '#ececec';
  return (
    <rect
      key={d}
      className={classNames('day', {'current-day': isCurrentDay})}
      width={cellSize}
      height={cellSize}
      rx={50}
      ry={50}
      fill={fillColor}
      y={(day(d) * cellSize) + (day(d) * cellMargin) + cellMargin}
      x={((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin}
      data-tip={`${moment(d).format('dddd, DD MMM YYYY')}<br>Count: ${props.data[item] || 0}`}
      data-for='svgTooltip'
    >
    </rect>
  )
};

const mapStateToProps = state => ({
  data: state.app.data,
  cellSize: state.calendar.cellSize,
  cellMargin: state.calendar.cellMargin
});

const mapDispatchToProps = dispatch => ({
  showRadialChart: val => dispatch(showRadialChart(val)),
  selectDay: val => dispatch(selectDay(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Day);
