import React from 'react';

class Bars extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1
    }
  }

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
