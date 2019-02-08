import React from 'react';
import moment from 'moment';

const Tooltip = props =>
  <div className='tooltip' style={props.style}>
    {moment(props.showTooltip).format('dddd, MMMM DD YYYY')}
    <div className='text'>
      Count: {props.count}
    </div>
  </div>;

export default Tooltip;
