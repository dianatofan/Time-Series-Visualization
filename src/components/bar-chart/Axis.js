import React from 'react';

class Axis extends React.Component {
  render() {
    const { xAxis, svgHeight } = this.props;
    return (
      xAxis
        ? <g className='axis axis-x'
             transform={`translate(0,${svgHeight - 50})`}
             ref='xAxis'
             fill='none'
             fontSize={10}
             textAnchor='middle'
        />
        : <g className='axis axis-y' ref='yAxis'/>
    )
  }
}

export default Axis;
