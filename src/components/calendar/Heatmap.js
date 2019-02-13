import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import DayLabels from './DayLabels';
import YearLabel from './YearLabel';
import Year from './Year';

import '../Spinner.scss';

class Heatmap extends React.Component {
  render () {
    return (
      this.props.isSpinnerVisible
        ? <div className='spinner'>
            <div className="double-bounce1" />
            <div className="double-bounce2" />
          </div>
        : <div id='calendar' ref='calendar'>
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

const mapStateToProps = state => ({
  isSpinnerVisible: state.app.isSpinnerVisible
});

export default connect(mapStateToProps)(Heatmap);
