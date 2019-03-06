import React from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import { connect } from 'react-redux';

import Day from './Day';

class Month extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 1
    };
  }

  componentDidMount() {
    this.showMoreData();
  }

  componentDidUpdate() {
    this.showMoreData();
  }

  showMoreData = () => {
    const { count } = this.state;
    const { month } = this.props;
    const days = d3.timeDays(month, new Date(month.getFullYear(), month.getMonth()+1, 1));
    if (count < days.length) {
      requestAnimationFrame(() => this.setState({ count: count+1 }));
    }
  };

  render() {
    const props = this.props;

    const month = props.month;

    const weeksInMonth = month => {
      const m = d3.timeMonth.floor(month);
      return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
    };

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
          { renderList.map(d => <Day day={d} month={month} key={d} />) }
        </g>
      </svg>
    )
  }
}

const mapStateToProps = state => ({
  data: state.app.data,
  cellSize: state.calendar.cellSize,
  cellMargin: state.calendar.cellMargin
});

export default connect(mapStateToProps)(Month);
