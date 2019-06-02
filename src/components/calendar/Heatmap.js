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

let x1, x2, y1, y2;

class Heatmap extends React.PureComponent {
  constructor(props) {
    super(props);
    window.addEventListener('resize', () => {
      props.onScreenResize(window.innerWidth);
    });
  }

  componentDidMount() {
    this.props.showSpinner(false);
    // this.brush = d3.brush()
    //   .extent([[0, 0], [600, 600]])
    //   .on('start', this.brushStart)
    //   .on('end', this.brushEnd);
    // d3.select(this.refs.brush).call(this.brush);
  }

  // brushStart = () => {
  //   const s = d3.event.selection,
  //     x0 = s[0][0],
  //     y0 = s[0][1],
  //     dx = s[1][0] - x0,
  //     dy = s[1][1] - y0,
  //     max = 0;
  //
  //   if (dx && dy) {
  //    console.log(dx, dy);
  //   }
  // };
  //
  // brushEnd = () => {
  //   if (!d3.event.selection) {
  //     return;
  //   }
  //   const [x1, x2] = d3.event.selection;
  //
  //   console.log(x1, x2);
  // };

  selectAll = ev => {
    if (ev.key === 'A' && ev.shiftKey) {
      this.props.onShiftClick('all');
    }
  };

  recalc = () => {
    const div = this.refs.div;
    const x3 = Math.min(x1, x2);
    const x4 = Math.max(x1, x2);
    const y3 = Math.min(y1, y2);
    const y4 = Math.max(y1, y2);
    div.style.left = x3 + 'px';
    div.style.top = y3 + 'px';
    div.style.width = x4 - x3 + 'px';
    div.style.height = y4 - y3 + 'px';
  };

  onMouseDown = ev => {
    const div = this.refs.div;
    div.hidden = 0;
    x1 = ev.clientX;
    y1 = ev.clientY;
    this.recalc();
  };

  onMouseMove = ev => {
    x2 = ev.clientX;
    y2 = ev.clientY;
    this.recalc();
  };

  onMouseUp = () => {
    const div = this.refs.div;
    div.hidden = 1;
  };

  //  onMouseDown={ev => this.onMouseDown(ev)} onMouseMove={ev => this.onMouseMove(ev)} onMouseUp={this.onMouseUp}

  render () {
    return (
      <Section title='Calendar heatmap'>
        <Card tabIndex={0} onKeyDown={ev => this.selectAll(ev)}>
          <YearLabel />
          <div className='months'>
            <DayLabels />
            <Year />
            <div id='div' ref='div' hidden />
          </div>
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
