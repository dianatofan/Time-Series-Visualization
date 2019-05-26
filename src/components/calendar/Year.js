import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as d3 from 'd3';
import moment from 'moment';

import Month from './Month';

class Year extends React.PureComponent {
  getChunk = (target, size) =>
    target.reduce((memo, value, index) => {
      if (index % (target.length / size) === 0 && index !== 0) memo.push([]);
      memo[memo.length - 1].push(value);
      return memo
    }, [[]]);

  getNrOfWeeks = month => {
    const daysInMonth = moment(month, 'M').daysInMonth();
    const nrOfWeeks = Math.ceil(daysInMonth / 7);
    const firstDay = moment(month, 'M').startOf('month').format('ddd');
    if (firstDay === 'Sat' || firstDay === 'Sun' || moment(month).format('MMM') === 'Feb') {
      return nrOfWeeks + 1;
    }
    return nrOfWeeks;
  };

  render() {
    const props = this.props;
    const minDate = props.minDate.format('YYYY-MM-DD');
    const maxDate = props.maxDate.format('YYYY-MM-DD');

    const months = d3.timeMonth.range(new Date(parseInt(`${minDate.split('-')[0]}`), 0, 1),
      new Date(parseInt(`${maxDate.split('-')[0]}`), 11, 31));

    const monthsArr = this.getChunk(months, months.length / 12);

    const arr = Array.from({length: 52}, (v, k) => k+1);

    let count = 0;

    return (
      <div className='year-wrapper'>
        {
          monthsArr.map((months, i) =>
            <div className={classNames('year', {'hidden': i !== props.yearIndex})} key={i}>
              {
                months.map((month, i) => {
                  let nrOfWeeks = this.getNrOfWeeks(month);
                    if (moment(month, 'M').endOf('month').format('ddd') === 'Sun' && moment(month, 'M').add(1, 'months').startOf('month').format('ddd') === 'Mon') {
                      count -= 1;
                    }
                  const renderArr = arr.slice(count, nrOfWeeks + count);
                  count += nrOfWeeks - 1;
                  return (
                    <Month
                      key={i}
                      month={month}
                      renderArr={renderArr}
                    />
                  )
                }
                )
              }
            </div>
          )
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  data: state.app.data,
  minDate: state.app.minDate,
  maxDate: state.app.maxDate,
  yearIndex: state.calendar.yearIndex
});

export default connect(mapStateToProps)(Year);
