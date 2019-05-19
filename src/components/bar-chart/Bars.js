import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import moment from 'moment';

import { openModal } from '../../reducers/barChart';

class Bars extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1
    }
  }

  componentDidMount() {
    this.renderBars();
  }

  componentDidUpdate() {
    this.renderBars();
  }

  openModal = d => {
    this.props.openModal({ data: d, arr: this.props.dayInsights[this.props.selectedDay] });
  };

  renderBars = () => {
    const parent = d3.select(this.refs.bars).datum(this.props.plotData);
    const current = parent.selectAll('.bar').data(d => d);

    current.interrupt();

    const color = this.props.color;

    current.transition()
      .attr('fill', (d, i) => i === this.state.hoverIndex ? d3.rgb(color).darker() : color);

    const enter = current.enter().append('g').classed('bar', true);
    enter
      .attr('fill', (d, i) => i === this.state.hoverIndex ? d3.rgb(color).darker() : color);

    enter
      .append('rect')
      .attr('height', 0)
      .attr('transform', d => `translate(${d.x}, ${this.props.plotHeight})`)
      .attr('id', (d, i) => `bar-${i}`)
      .on('mouseover', (d, i) => { this.setState({ hoverIndex: i }) })
      .on('mouseleave', () => this.setState({ hoverIndex: -1 }))
      .on('click', d => this.openModal(d));

    const exit = current.exit().classed('bar', false);
    exit
      .attr('fill', color)
      .attr('opacity', 0.8)
      .transition()
      .attr('opacity', 0)
      .remove();

    current
      .merge(enter)
      .select('rect')
      .attr('width', d => d.width)
      .attr('data-tip', d => `${d.occurrences} occurrences<br>between ${moment(d.data, 'hh').format('H:mm')} - ${moment(parseInt(d.data)+1, 'hh').format('H:mm')}`)
      .attr('data-for', 'rectTooltip')
      .classed('hovered-bar', (d, i) => i === this.state.hoverIndex)
      .transition()
      .duration(1000)
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .attr('height', d => d.height);
  };

  render() {
    return (
      <g ref='bars' />
    )
  }
}

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  selectedDay: moment(state.calendar.selectedDay).format('YYYY-MM-DD')
});

const mapDispatchToProps = dispatch => ({
  openModal: val => dispatch(openModal(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Bars);
