import React from 'react';
import * as d3 from 'd3';

class YAxis extends React.PureComponent {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis = () => {
    const yAxis = d3.axisLeft(this.props.yScale)
      .ticks(this.props.nrOfTicks)
      .tickFormat(d3.format('d'));
    d3.select(this.refs.yAxis)
      .transition()
      .call(yAxis);
    d3.select(this.refs.yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 10 - this.props.margin.left)
      .attr('x', -36)
      .attr('dy', '1em')
      .style('fill', '#000')
      .style('font-size', 12)
      .style('text-anchor', 'middle')
      .text('Observations');
  };

  render() {
    return (
      <g className='axis axis-y' ref='yAxis' />
    )
  }
}

export default YAxis;
