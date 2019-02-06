import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import classNames from 'classnames';
import moment from 'moment';
import { showRadialChart, selectDay } from '../../reducers/radialChart';

import DayLabels from './DayLabels';
import Tooltip from './Tooltip';
import YearLabel from './YearLabel';
import Year from './Year';

class Heatmap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showTooltip: false,
      renderBarChart: false,
      style: {},
      currentYear: null,
      i: 0
    };
    this.renderChart = this.renderChart.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.changeYear = this.changeYear.bind(this);
    this.renderYear = this.renderYear.bind(this);
    this.renderMonth = this.renderMonth.bind(this);
    this.renderDay = this.renderDay.bind(this);
  }

  updateDimensions() {
    this.setState({
      cellSize: window.innerWidth / 125,
      cellMargin: window.innerWidth / 400
    });
  }

  componentWillMount() {
    const moments = Object.keys(this.props.data).map(d => moment(d));
    this.setState({
      currentYear: moment.min(moments).format('YYYY'),
      maxYear: moment.max(moments).format('YYYY'),
      minDate: moment.min(moments),
      maxDate: moment.max(moments)
    });
    this.updateDimensions();
  }

  componentDidMount() {
    // window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    return (
      <div id='calendar'>
        <DayLabels />
        <Tooltip
          style={this.state.style}
          showTooltip={this.state.showTooltip}
          count={this.state.count}
        />
        <YearLabel
          minDate={this.state.minDate}
          maxDate={this.state.maxDate}
          changeYear={this.changeYear}
        />
        <div className='months'>
          { this.drawCalendar(this.props.data, this.state.i) }
        </div>
      </div>
    );
  }

  changeYear(value) {
    this.setState({
      currentYear: parseInt(this.state.currentYear)+value,
      i: this.state.i+value
    });
  }

  renderChart(d) {
    const day = moment(d).format('YYYY-MM-DD');
    this.props.showRadialChart(true);
    this.props.selectDay(day);
  }

  drawCalendar(dateData, i) {
    // const monthName = d3.timeFormat('%B'),
    // months = d3.timeMonth.range(new Date(parseInt(`${minDate.split('-')[0]}`), 0, 1),
    //   new Date(parseInt(`${maxDate.split('-')[0]}`), 11, 31));

    const minDate = this.state.minDate.format('YYYY-MM-DD'); // new Date(2016, 0, 1);
    const maxDate = this.state.maxDate.format('YYYY-MM-DD'); // new Date(2020, 11, 31);

    const months = d3.timeMonth.range(new Date(parseInt(`${minDate.split('-')[0]}`), 0, 1),
      new Date(parseInt(`${maxDate.split('-')[0]}`), 11, 31));

    // const months = d3.timeMonth.range(minDate, maxDate);
    const years = d3.timeYear.range(new Date(minDate), new Date(maxDate));

    const yearsArr = years.map(year => moment(year).format('YYYY'));
    const chunk = (target, size) => {
      return target.reduce((memo, value, index) => {
        // Here it comes the only difference
        if (index % (target.length / size) === 0 && index !== 0) memo.push([]);
        memo[memo.length - 1].push(value);
        return memo
      }, [[]])
    };
    const monthsArr = chunk(months, months.length / 12);

    // render only first year
    return this.renderYear(yearsArr, years[0], months, dateData, monthsArr);
  }

  renderYear(years, year, months, dateData, monthsArr) {
    const previousYear = moment(this.state.currentYear).subtract(1, 'years').format('YYYY');
    const nextYear = moment(this.state.currentYear).add(1, 'years').format('YYYY');
    const showPreviousArrow = previousYear >= this.state.minDate.format('YYYY');
    const showNextArrow = nextYear <= this.state.maxDate.format('YYYY');
    return (
      <div key={year}>
          {
            monthsArr.map((months, i) => {
              return <div className={classNames('year', {'hidden': i !== this.state.i})} key={i}>
                {months.map(month => this.renderMonth(month, dateData))}
              </div>
            })
          }
      </div>
      );
  }

  renderMonth(month, dateData) {
    const weeksInMonth = month => {
      const m = d3.timeMonth.floor(month);
      return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
    };

    const cellMargin = this.state.cellMargin,
      cellSize = this.state.cellSize;

    const monthName = d3.timeFormat('%B');
    const yearName = d3.timeFormat('%Y');

    const days = d3.timeDays(month, new Date(month.getFullYear(), month.getMonth()+1, 1));
    const lastDay = moment(month).endOf('month').format('ddd'); // last day of current month
    const firstDay = moment(month).add(1, 'months').startOf('month').format('ddd'); // first day of next month
    let extraSpace = 0;
    if ((lastDay === 'Mon' && firstDay === 'Tue') || (lastDay === 'Tue' && firstDay === 'Wed')) {
      extraSpace += 10;
    }
    return (
      <svg
        className='month'
        height={((cellSize * 7) + (cellMargin * 8) + 20)}
        width={(cellSize * weeksInMonth(month)) + (cellMargin * (weeksInMonth(month) + 5)) + extraSpace}
        key={month}
      >
        <g>
          <text
            className='month-name'
            y={(cellSize * 7) + (cellMargin * 8) + 15}
            x={((cellSize * weeksInMonth(month)) + (cellMargin * (weeksInMonth(month) + 1))) / 2}
            textAnchor='middle'
          >
            { monthName(month) }
          </text>
          { days.map(d => this.renderDay(d, month, dateData)) }
        </g>
      </svg>
    );
  }

  renderDay(d, month, dateData) {
    const cellMargin = this.state.cellMargin,
      cellSize = this.state.cellSize;
    let isCurrentDay = false;
    if (moment(d).format('DD-MM-YY') === moment().format('DD-MM-YY')) {
      isCurrentDay = true;
    }

    const day = d => (d.getDay() + 6) % 7,
      week = d3.timeFormat('%W');

    const normalize = (val, max, min) => (1 - 0.25) * ((val - min) / (max - min)) + 0.25;

    const days = d3.timeDays(month, new Date(month.getFullYear(), month.getMonth()+1, 1));
    let filters = days.map(d =>
      Object.keys(dateData).find(key =>
        new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0))
    );
    const count = filters.map(i => !!i && dateData[i]).filter(j => !!j);

    const item = Object.keys(dateData).find(key =>
      new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0));
    const value = !!dateData[item] && normalize(dateData[item], Math.max(...count), Math.min(...count));
    const fillColor = !!dateData[item] ? d3.interpolatePurples(value) : '#ececec';
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
        onMouseOver={(ev) => this.setState({
          showTooltip: d,
          count: !!dateData[item] ? dateData[item] : 0,
          style: {
            top: ev.clientY + 10,
            left: ev.clientX + 10
          }
        })}
        onMouseOut={() => this.setState({
          showTooltip: false
        })}
        onClick={() => this.renderChart(d)}
      >
      </rect>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  showRadialChart: val => dispatch(showRadialChart(val)),
  selectDay: val => dispatch(selectDay(val)),
});

export default connect(null, mapDispatchToProps)(Heatmap);
