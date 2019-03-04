import React from 'react';

class XAxis extends React.Component {
  render() {
    return (
      <g className='axis axis-x'
         transform={`translate(0,${this.props.svgHeight - 50})`}
         ref='xAxis'
         fill='none'
         fontSize={10}
         textAnchor='middle'
      />
    )
  }
}

export default XAxis;
