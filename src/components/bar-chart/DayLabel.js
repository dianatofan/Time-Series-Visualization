import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { changeDay } from '../../reducers/barChart';

const DayLabel = ({ selectedDay, minDate, maxDate, changeDay }) => {
  const previousDay = moment(selectedDay).subtract(1, 'days');
  const nextDay = moment(selectedDay).add(1, 'days');
  const showPreviousArrow = previousDay.isAfter(minDate.startOf('year'));
  const showNextArrow = nextDay.isBefore(maxDate.endOf('year'));

  return (
    <div className='yearLabel'>
      <i
        className={classNames('fas fa-chevron-left', {'disabled': !showPreviousArrow})}
        onClick={() => showPreviousArrow && changeDay(-1)}
      />
      { moment(selectedDay).format('dddd, MMMM DD YYYY') }
      <i
        className={classNames('fas fa-chevron-right', {'disabled': !showNextArrow})}
        onClick={() => showNextArrow && changeDay(+1)}
      />
    </div>
  )
};

const mapStateToProps = state => ({
  minDate: state.app.minDate,
  maxDate: state.app.maxDate
});

const mapDispatchToProps = dispatch => ({
  changeDay: val => dispatch(changeDay(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(DayLabel);
