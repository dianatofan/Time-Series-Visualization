import React from 'react';
import * as d3 from 'd3';

class Bars extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1,
      modalOpen: null
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
    const openModal = d => {
      this.setState({
        modalOpen: d
      });
    };

    current.interrupt();

    const color = this.props.color; //'#6595ec';

    current.transition()
      .attr('fill', (d, i) => i === this.state.hoverIndex ? d3.rgb(color).darker() : color);

    const enter = current.enter().append('g').classed('bar', true);
    enter
      .attr('fill', (d, i) => i === this.state.hoverIndex ? d3.rgb(color).darker() : color);

    enter
      .append('rect')
      .attr('height', 0)
      .attr('transform', d => `translate(${d.x}, ${this.props.plotHeight})`)
      .on('mouseover', (d, i) => this.setState({ hoverIndex: i }))
      .on('mouseleave', () => this.setState({ hoverIndex: -1 }))
      .on('click', d => openModal(d));

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
      .attr('data-tip', d => `Time - ${d.data}:00 <br> Occurrences - ${d.occurrences}`)
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

export default Bars;
