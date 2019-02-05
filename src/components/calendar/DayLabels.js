import React from 'react';
import moment from 'moment';

const weekArray = Array.apply(null, Array(7)).map(function (_, i) {
  return moment(i, 'e').startOf('week').isoWeekday(i+1).format('ddd');
});

const DayLabels = () =>
  <g>
    {
      weekArray.map(day =>
        <text
          key={day}
          className='dayLabels'
        >
          {day}
        </text>
      )
    }
  </g>;

export default DayLabels;