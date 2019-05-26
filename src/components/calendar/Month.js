import React from 'react';
import classNames from 'classnames';
import * as d3 from 'd3';
import moment from 'moment';
import { connect } from 'react-redux';

import Day from './Day';
import { getMonthInsights, getWeekInsights } from '../../helpers/parser';
import {setMonthInsights, setWeekdayInsights} from "../../reducers/app";
import { showBarChart } from "../../reducers/barChart";
import { selectDay } from '../../reducers/calendar';

class Month extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
      weekLabel: 0
    };
  }

  componentDidMount() {
    this.showMoreData();
  }

  componentDidUpdate() {
    this.showMoreData();
  }

  showMoreData = () => {
    let { count } = this.state;
    const { month } = this.props;
    const days = d3.timeDays(month, new Date(month.getFullYear(), month.getMonth() + 1, 1));
    if (count < days.length) {
      requestAnimationFrame(() => this.setState({ count: count + 2 }));
    }
  };

  getWeeksInMonth = month => {
    const m = d3.timeMonth.floor(month);
    return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
  };

  getChunk = (target, size) =>
    target.reduce((memo, value, index) => {
      if (index % (target.length / size) === 0 && index !== 0) memo.push([]);
      memo[memo.length - 1].push(value);
      return memo
    }, [[]]);

  renderMonthOverview = month => {
    this.props.selectDay(null);
    this.props.setWeekdayInsights({
      selectedWeekday: null,
      daysOfWeekday: [],
      weekdayInsights: []
    });
    const monthInsights = getMonthInsights(moment().month(month).format('M'), this.props.dayInsights, this.props.allDays);
    this.props.setMonthInsights({
      selectedMonth: monthInsights.selectedMonth,
      daysOfMonth: monthInsights.daysOfMonth,
      monthInsights: monthInsights.monthInsights
    });
    this.props.showBarChart(true);
  };

  renderWeekOverview = week => {
    console.log(week);
    this.props.selectDay(null);
    this.props.setWeekdayInsights({
      selectedWeekday: null,
      daysOfWeekday: [],
      weekdayInsights: []
    });
    this.props.setMonthInsights({
      selectedMonth: null,
      daysOfMonth: [],
      monthInsights: []
    });
    const weekInsights = getWeekInsights(week, this.props.dayInsights, this.props.allDays);
    this.props.showBarChart(true);
  };

  renderDays = (renderList, isCurrentMonth) =>
    renderList.map(d => <Day fill={isCurrentMonth || moment(d).format('ddd') === this.props.selectedWeekday} day={d} month={this.props.month} key={d} />);

  renderWeekLabels = (cellSize, cellMargin, month) => {
    const nrOfWeeks = this.props.renderArr.length;
    let offsets = [0.1, 0.3, 0.5, 0.7, 0.9, 1.1].slice(0, nrOfWeeks);
    return this.props.renderArr.map((week, i) =>
      <text
        className='week slow-fade-in'
        key={week}
        y={cellSize}
        x={((cellSize * this.getWeeksInMonth(month)) + (cellMargin * (this.getWeeksInMonth(month)))) * offsets[i]}
        textAnchor='middle'
        onClick={() => this.renderWeekOverview(week)}
      >
        { week }
      </text>
    )
  };

  render() {
    const props = this.props;

    const month = props.month;
    const cellMargin = props.cellMargin,
      cellSize = props.cellSize;

    const monthName = d3.timeFormat('%B');

    const days = d3.timeDays(month, new Date(month.getFullYear(), month.getMonth()+1, 1));
    const lastDay = moment(month).endOf('month').format('ddd'); // last day of current month
    const firstDay = moment(month).add(1, 'months').startOf('month').format('ddd'); // first day of next month
    let extraSpace = 0;
    if ((lastDay === 'Mon' && firstDay === 'Tue') || (lastDay === 'Tue' && firstDay === 'Wed')) {
      extraSpace += 10;
    }

    const { count } = this.state;

    const endReached = count >= days.length;
    const renderList = endReached ? days : days.slice(0, count);

    const isCurrentMonth = moment(this.props.selectedMonth, 'M').format('MMMM') === monthName(month);

    return (
      <svg
        className='month'
        height={((cellSize * 7) + (cellMargin * 8) + 50)}
        width={(cellSize * this.getWeeksInMonth(month)) + (cellMargin * (this.getWeeksInMonth(month) + 5)) + extraSpace}
        key={month}
      >
        <g>
          {
          endReached &&
            <text
              className={classNames('month-name', 'slow-fade-in', {'bold': isCurrentMonth})}
              y={(cellSize * 7) + (cellMargin * 8) + 35}
              x={((cellSize * this.getWeeksInMonth(month)) + (cellMargin * (this.getWeeksInMonth(month) + 1))) / 2}
              textAnchor='middle'
              onClick={() => this.renderMonthOverview(monthName(month))}
            >
              { monthName(month) }
            </text>
          }
          { endReached && this.renderWeekLabels(cellSize, cellMargin, month) }
          { this.renderDays(renderList, isCurrentMonth) }
        </g>
      </svg>
    )
  }
}

const mapStateToProps = state => ({
  allDays: state.app.allDays,
  data: state.app.data,
  dayInsights: state.app.dayInsights,
  cellSize: state.calendar.cellSize,
  cellMargin: state.calendar.cellMargin,
  selectedMonth: state.app.selectedMonth,
  selectedWeekday: state.app.selectedWeekday
});

const mapDispatchToProps = dispatch => ({
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  selectDay: val => dispatch(selectDay(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Month);
