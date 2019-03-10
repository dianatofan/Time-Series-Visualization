import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import * as d3 from 'd3';
import { selectDay, showBarChart } from '../../reducers/barChart';
import { setMonthInsights } from '../../reducers/app';

class Day extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    const formatDate = date => moment(date).format('DD-MM-YY');
    return formatDate(this.props.day) === formatDate(nextProps.selectedDay) ||
      formatDate(nextProps.day) === formatDate(this.props.selectedDay) ||
      this.props.fill !== nextProps.fill;
  }

  componentDidUpdate() {
    this.renderDots();
  }

  renderDots = () => {
    // let dots = d3.selectAll('.day')
    //   .data(this.props.day, d => d);
    //
    // dots
    //   .transition()
    //   .duration(100)
    //   .ease('ease-in')
    //   .style('opacity', 1);
    //
    // dots.enter().append('rect')
    //   .attr('class', 'day')
    //   .attr('r', function(d) { return r(d.r); })
    //   .attr('cx', function(d) { return x(d.x); })
    //   .attr('cy', 0)
    //   .style('stroke', '#3E6E9C')
    //   .transition().duration(1000)
    //   .attr('cy', function(d) { return y(d.y); })
    //   .style('stroke', '#81E797');
    //
    // item.exit().filter(':not(.exiting)') // Don't select already exiting nodes
    //   .classed('exiting', true)
    //   .transition().duration(1000)
    //   .attr('cy', height)
    //   .style('stroke', '#3E6E9C')
    //   .remove();
  };

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

    const item = Object.keys(props.data).find(key =>
      new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0));
    const value = !!props.data[item] && normalize(props.data[item], Math.max(...count), Math.min(...count));
    let fillColor = !!props.data[item] ? d3.interpolatePurples(value) : '#ececec';

    const onDayClick = ev => {
      ev.preventDefault();
      ev.stopPropagation();
      props.setMonthInsights({
        monthInsights: [],
        daysOfMonth: []
      });
      props.selectDay(d);
      props.showBarChart(true);
    };
    return (
      <rect
        key={d}
        className={classNames('day', {'fill': isCurrentDay || props.fill})}
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
  selectedDay: state.barChart.selectedDay,
  dayInsights: state.app.dayInsights,
  cellSize: state.calendar.cellSize,
  cellMargin: state.calendar.cellMargin
});

const mapDispatchToProps = dispatch => ({
  showBarChart: val => dispatch(showBarChart(val)),
  selectDay: val => dispatch(selectDay(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Day);
