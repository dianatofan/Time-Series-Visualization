import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import DayLabels from './DayLabels';
import YearLabel from './YearLabel';
import Year from './Year';

import '../Spinner.scss';
import { showSpinner } from '../../reducers/app';

class Heatmap extends React.Component {
  componentDidMount() {
    this.props.showSpinner(false);
  }

  render () {
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

const mapDispatchToProps = dispatch => ({
  showSpinner: val => dispatch(showSpinner(val))
});

export default connect(null, mapDispatchToProps)(Heatmap);
