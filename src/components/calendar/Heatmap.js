import React from 'react';
import ReactTooltip from 'react-tooltip';

import DayLabels from './DayLabels';
import YearLabel from './YearLabel';
import Year from './Year';

class Heatmap extends React.Component {
  render() {
    return (
      <div id='calendar' ref='calendar'>
        <DayLabels />
        <YearLabel />
        <div className='months'>
          <Year />
        </div>
        <ReactTooltip id='svgTooltip' multiline class='tooltipx'/>
      </div>
    )
  }
}
export default Heatmap;
