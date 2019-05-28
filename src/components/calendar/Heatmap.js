import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import DayLabels from './DayLabels';
import YearLabel from './YearLabel';
import Year from './Year';
import Card from '../widget/Card';
import Section from '../widget/Section';

import '../Spinner.scss';
import {onShiftClick, showSpinner} from '../../reducers/app';
import { onScreenResize } from '../../reducers/calendar';

class Heatmap extends React.PureComponent {
  constructor(props) {
    super(props);
    window.addEventListener('resize', () => {
      props.onScreenResize(window.innerWidth);
    });
  }

  componentDidMount() {
    this.props.showSpinner(false);
  }

  selectAll = ev => {
    if (ev.key === 'A' && ev.shiftKey) {
      this.props.onShiftClick('all');
    }
  };

  render () {
    return (
      <Section title='Calendar heatmap' tabIndex={0} onKeyDown={ev => this.selectAll(ev)}>
        <Card>
          <YearLabel />
          <div className='months'>
            <DayLabels />
            <Year />
          </div>
          <ReactTooltip id='svgTooltip' multiline class='tooltip'/>
        </Card>
      </Section>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  showSpinner: val => dispatch(showSpinner(val)),
  onScreenResize: val => dispatch(onScreenResize(val)),
  onShiftClick: val => dispatch(onShiftClick(val))
});

export default connect(null, mapDispatchToProps)(Heatmap);
