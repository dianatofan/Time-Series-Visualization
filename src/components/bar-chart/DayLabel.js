import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { selectDay } from '../../reducers/barChart';

class DayLabel extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selectedDay !== this.props.selectedDay;
  }

  render() {
    const { selectedDay, minDate, maxDate, selectDay } = this.props;
    const previousDay = moment(selectedDay).subtract(1, 'days');
    const nextDay = moment(selectedDay).add(1, 'days');
    const showPreviousArrow = previousDay.isAfter(minDate.startOf('year'));
    const showNextArrow = nextDay.isBefore(maxDate.endOf('year'));

    return (
      <div className='yearLabel'>
        <i
          className={classNames('fas fa-chevron-left', {'disabled': !showPreviousArrow})}
          onClick={() => {showPreviousArrow && selectDay(moment(selectedDay).add(-1, 'days'))}}
        />
        { moment(selectedDay).format('dddd, MMMM DD YYYY') }
        <i
          className={classNames('fas fa-chevron-right', {'disabled': !showNextArrow})}
          onClick={() => showNextArrow && selectDay(moment(selectedDay).add(1, 'days'))}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  minDate: state.app.minDate,
  maxDate: state.app.maxDate,
  selectedDay: state.barChart.selectedDay
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(DayLabel);
