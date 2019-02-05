import React from 'react';
import classNames from 'classnames';

import Month from './Month';

const Year = props =>
  <div key={props.key}>
    {
      props.monthsArr.map((months, i) =>
        <div className={classNames('year', {'hidden': i !== props.i})} key={i}>
          {
            months.map(month =>
             <Month
               month={month}
               data={props.data}
             />
            )
          }
        </div>
      )
    }
  </div>;

export default Year;
