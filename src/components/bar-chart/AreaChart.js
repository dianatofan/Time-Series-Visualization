import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import moment from 'moment';

class AreaChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circleHoverIndex: -1,
      showTooltip: false,
      domainX: null,
      domainY: null
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selectedDay !== this.props.selectedDay ||
      nextProps.plotWidth !== this.props.plotWidth;
  }

  componentDidMount() {
    this.renderLine();
  }

  componentDidUpdate() {
    this.renderLine();
  }

  renderLine = () => {
    let line = d3.selectAll('.line');
    if (line.node()) {
      const totalLength = line.node().getTotalLength();
      line
        .attr('stroke-dasharray', totalLength)
        .attr('stroke-dashoffset', totalLength)
        .attr('stroke-width', 6)
        .attr('stroke', '#7888BF')
        .transition()
        .duration(1000)
        .attr('stroke-width', 0)
        .attr('stroke-dashoffset', 0);
    }
    let area = d3.selectAll('.area');
    area
      .attr('transform', 'translate(0,300)')
      .transition()
      .delay(500)
      .duration(1000)
      .attr('transform', 'translate(0,0)');
  };


  handleMouseMove = (mouseX, mouseY) => {
    const { yScale, plotHeight } = this.props;

    d3.select('.mouse-line')
      .attr('d', function() {
        let d = 'M' + mouseX + ',' + (plotHeight - 50);
        d += ' ' + mouseX + ',' + 0;
        return d;
      });

    const lines = document.getElementsByClassName('line');
    let pos;

    d3.selectAll('.mouse-per-line')
      .attr('transform', function(d, i) {
        let beginning = 0,
          end = lines && lines[i].getTotalLength(),
          target = null;

        while (end){
          target = Math.floor((beginning + end) / 2);
          pos = lines[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouseX) {
            break;
          }
          if (pos.x > mouseX)      end = target;
          else if (pos.x < mouseX) beginning = target;
          else break; //position found
        }

        d3.select(this).select('text')
          .text(Number(yScale.invert(pos.y)).toFixed(2));

        return 'translate(' + mouseX + ',' + pos.y +')';
      });
  };

  render() {
    const { xScale, plotWidth, plotHeight, margin, yScale } = this.props;

    const weekObj = this.props.weekInsights;

    // define the area
    const area = d3.area()
      .x(d => xScale(d))
      .y0(plotHeight - margin.top - margin.bottom)
      .y1(d => yScale(weekObj[d]))
      .curve(d3.curveMonotoneX);

    const valueline = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(weekObj[d]))
      .curve(d3.curveMonotoneX);

    return (
      <svg className='areaChart' ref='areaChart'>
        <defs>
          <linearGradient id='grad' x1='0%' y1='100%' x2='0%' y2='0%' spreadMethod='pad'>
            <stop offset='10%' stopColor='#fff' stopOpacity={.4}/>
            <stop offset='80%' stopColor='#7888BF' stopOpacity={.8}/>
          </linearGradient>
        </defs>
        <path className='area'
              fill='url(#grad)'
              d={area(Object.keys(weekObj))}
        />
        <path className='line shadow'
              d={valueline(Object.keys(weekObj))}
        />
        <g className='mouse-over-effects'>
          <path
            className='mouse-line'
            stroke='#000'
            strokeWidth={1}
            opacity={0}
          >
          </path>
          <g
            className='mouse-per-line'
          >
            <circle
              r={5}
              fill='#7888BF'
              strokeWidth={1}
              stroke='#000'
              opacity={0}
            />
            <text
              transform='translate(10,3)'
              fontSize={14}
              // fill='#777'
            />
          </g>
          <rect
            width={plotWidth + 40}
            height={plotHeight}
            fill='none'
            pointerEvents='all'
            onMouseLeave={() => {
              d3.select('.mouse-line')
                .style('opacity', '0');
              d3.selectAll('.mouse-per-line circle')
                .style('opacity', '0');
              d3.selectAll('.mouse-per-line text')
                .style('opacity', '0');
            }}
            onMouseOver={() => {
              d3.select('.mouse-line')
                .style('opacity', '1');
              d3.selectAll('.mouse-per-line circle')
                .style('opacity', '1');
              d3.selectAll('.mouse-per-line text')
                .style('opacity', '1');
            }}
            onMouseMove={ev => this.handleMouseMove(ev.nativeEvent.offsetX - 40, ev.nativeEvent.offsetY) }
          >
          </rect>
        </g>
      </svg>
    )
  }
}

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  selectedDay: moment(state.calendar.selectedDay),
  data: state.app.data
});


export default connect(mapStateToProps)(AreaChart);
