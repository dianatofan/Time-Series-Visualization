import React from 'react';
import moment from 'moment';
import classNames from 'classnames';

const YearLabel = props => {
  const previousYear = moment(props.minDate).subtract(1, 'years').format('YYYY');
  const nextYear = moment(props.maxDate).add(1, 'years').format('YYYY');
  const showPreviousArrow = previousYear >= props.minDate.format('YYYY');
  const showNextArrow = nextYear <= props.maxDate.format('YYYY');

  return (
    <div className='yearLabel'>
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

export default YearLabel;
