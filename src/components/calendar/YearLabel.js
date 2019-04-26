import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { changeYear } from '../../reducers/calendar';

const YearLabel = props => {
  const previousYear = moment(props.minDate).subtract(1, 'years').format('YYYY');
  const nextYear = moment(props.maxDate).add(1, 'years').format('YYYY');
  const showPreviousArrow = previousYear >= props.minDate.format('YYYY');
  const showNextArrow = nextYear <= props.maxDate.format('YYYY');

  return (
    <div className='year-label'>
      <i
        className={classNames('fas fa-chevron-left', {'disabled': !showPreviousArrow})}
        onClick={() => showPreviousArrow && props.changeYear(-1)}
      />
      { props.minDate.format('YYYY') }
      <i
        className={classNames('fas fa-chevron-right', {'disabled': !showNextArrow})}
        onClick={() => showNextArrow && props.changeYear(+1)}
      />
    </div>
  )
};

const mapStateToProps = state => ({
  minDate: state.app.minDate,
  maxDate: state.app.maxDate
});

const mapDispatchToProps = dispatch => ({
  changeYear: val => dispatch(changeYear(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(YearLabel);
