import React from 'react';

const YearLabel = props =>
  <div className='yearLabel'>
    <i className='fas fa-chevron-left' onClick={() => props.changeYear(-1)} />
    { props.currentYear }
    <i className='fas fa-chevron-right' onClick={() => props.changeYear(+1)} />
  </div>;

export default YearLabel;
