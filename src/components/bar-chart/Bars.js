import React from 'react';
import * as d3 from "d3";

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
    const parent = d3.select(this.refs.anchor).datum(this.props.plotData);

    const current = parent.selectAll(".bar").data(d => d);

    current.interrupt();

    current.transition().attr("fill", "green");

    const enter = current.enter().append("g").classed("bar", true);
    enter.attr("fill", "blue");

    enter
      .append("rect")
      .attr("height", 0)
      .attr("transform", d => `translate(${d.x}, ${this.props.plotHeight})`);

    const exit = current.exit().classed("bar", false);
    exit
      .attr("fill", "red")
      .attr("opacity", 1)
      .transition()
      .attr("opacity", 0)
      .remove();

    const rect = current
      .merge(enter)
      .select("rect")
      .attr("width", d => d.width)
      .transition()
      .duration(1000)
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .attr("height", d => d.height);
  };

  render() {
    const { xScale, yScale, occurrences, height } = this.props;
    return (
      Object.keys(occurrences).map((item, i) =>
        <rect
          className='bar'
          key={i}
          x={xScale(item) || 0}
          y={yScale(occurrences[item]) || 0}
          width={xScale.bandwidth() || 0}
          height={(height - yScale(occurrences[item])) || 0}
          fill={`${i === this.state.hoverIndex ? "#5455D6" : "#6595ec"}`}
          onMouseOver={() => this.setState({ hoverIndex: i })}
          onMouseLeave={() => this.setState({ hoverIndex: -1 })}
          data-tip={`Time - ${item}:00 <br> Occurrences - ${occurrences[item]}`}
          data-for='rectTooltip'
        />
      )
    )
  }
}

export default Bars;
