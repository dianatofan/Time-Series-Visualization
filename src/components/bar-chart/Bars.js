import React from 'react';
import * as d3 from 'd3';

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

  renderBars = () => {
    const parent = d3.select(this.refs.bars).datum(this.props.plotData);
    const current = parent.selectAll('.bar').data(d => d);

    current.interrupt();

    current.transition()
      .attr('fill', '#6595ec');

    const enter = current.enter().append('g').classed('bar', true);
    enter.attr('fill', '#6595ec');

    enter
      .append('rect')
      .attr('height', 0)
      .attr('transform', d => `translate(${d.x}, ${this.props.plotHeight})`)
      .attr('data-tip', d => `Time - ${d.data}:00 <br> Occurrences - ${d.occurrences}`)
      .attr('data-for', 'rectTooltip')
      .classed('hover', (d, i) => i === this.state.hoverIndex)
      .on('mouseover', (d, i) => this.setState({ hoverIndex: i }))
      .on('mouseleave', () => this.setState({ hoverIndex: -1 }));

    const exit = current.exit().classed('bar', false);
    exit
      .attr('fill', '#6595ec')
      .attr('opacity', 0.8)
      .transition()
      .attr('opacity', 0)
      .remove();

    const rect = current
      .merge(enter)
      .select('rect')
      .attr('width', d => d.width)
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

export default Bars;
