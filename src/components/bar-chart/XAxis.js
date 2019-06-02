import React from 'react';
import * as d3 from "d3";

class XAxis extends React.PureComponent {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis = () => {
    const xAxis = d3.axisBottom(this.props.xScale)
      .ticks(24)
      .tickFormat(d3.timeFormat('%H'));
    d3.select(this.refs.xAxis)
      .transition()
      .call(xAxis);
    d3.select(this.refs.xAxis)
     .append('text')
      .attr('y', 35)
      .attr('x', this.props.width - 70)
      .style('text-anchor', 'middle')
      .style('fill', '#000')
      .style('font-size', 12)
      .text('Hour of the day');
  };

  render() {
    return (
      <g className='axis axis-x'
         transform={this.props.transform}
         ref='xAxis'
         fill='none'
         fontSize={10}
         textAnchor='middle'
      />
    )
  }
}

export default XAxis;
