import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import moment from 'moment';

class AreaChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cursorPointer: -1
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
    const { xScale, yScale, plotHeight, color, plotData } = this.props;

    d3.select('.mouse-line')
      .attr('d', function() {
        let d = 'M' + mouseX + ',' + (plotHeight - 50);
        d += ' ' + mouseX + ',' + 0;
        return d;
      });

    const lines = document.getElementsByClassName('line');
    let pos;

    const formatTime = d3.timeFormat('%H');
    const parseTime = d3.timeParse('%H');

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

        const x = xScale.invert(pos.x);

        d3.selectAll('.bar')
          .attr('fill', d =>  formatTime(parseTime(d.data)) === formatTime(x) ? d3.rgb(color).darker() : color);

        return 'translate(' + mouseX + ',' + pos.y +')';
      });

    d3.selectAll('.mouse-per-bar')
      .attr('transform', function(d, i) {

        const bars = plotData.map(i => moment(i.data, 'H').format('HH'));

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

        const x = xScale.invert(pos.x);

        if (bars.indexOf(formatTime(x)) > -1) {
          const item = plotData.find(i => moment(i.data, 'H').format('HH') === formatTime(x));
          // let repeat = () => {
          //   d3.select(`#bar-${item.id}`)
          //     .transition()
          //     .duration(500)
          //     .ease(d3.easeLinear)
          //     .attr('width', item.width * 1.2)
          //     .transition()
          //     .duration(500)
          //     .ease(d3.easeLinear)
          //     .attr('width', item.width)
          //     .attr('height', item.height)
          // };
          d3.select('.mouse-over-effects')
            .style('cursor', 'pointer');
          d3.select('.bar-text')
            .style('opacity', 1)
            .text(item.occurrences);
          d3.select('.bar-circle')
            .style('opacity', 1);
          return 'translate(' + mouseX + ',' + `${item.y - 3.8}` +')'
        }
        d3.select('.mouse-over-effects')
          .style('cursor', 'auto');
        d3.select('.bar-text')
          .style('opacity', 0);
        d3.select('.bar-circle')
          .style('opacity', 0);
      });
  };

  render() {
    const { xScale, plotWidth, plotHeight, margin, yScale } = this.props;

    const weekObj = this.props.weekInsights;

    const parseTime = d3.timeParse('%H');

    // define the area
    const area = d3.area()
      .x(d => xScale(parseTime(d)))
      .y0(plotHeight - margin.top - margin.bottom)
      .y1(d => yScale(weekObj[d]))
      .curve(d3.curveMonotoneX);

    const valueline = d3.line()
      .x((d, i) => xScale(parseTime(i)))
      .y(d => yScale(weekObj[d]))
      .curve(d3.curveMonotoneX);

    const setLineOpacity = val => {
      d3.select('.mouse-line')
        .style('opacity', val);
      d3.selectAll('.mouse-per-line .line-circle')
        .style('opacity', val);
      d3.selectAll('.mouse-per-line .line-text')
        .style('opacity', val);
    };

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
              className='line-circle'
              r={5}
              fill='#7888BF'
              strokeWidth={1}
              stroke='#000'
              opacity={0}
            />
            <text
              className='line-text'
              transform='translate(10,3)'
              fontSize={14}
            />
          </g>
          <g className='mouse-per-bar'>
            <circle
              className='bar-circle'
              r={5}
              fill={d3.rgb(this.props.color).darker()}
              strokeWidth={1}
              stroke='#000'
              opacity={0}
            />
            <text
              className='bar-text'
              transform='translate(-17,3)'
              fontSize={14}
              opacity={0}
            />
          </g>
          <rect
            width={plotWidth + 40}
            height={plotHeight}
            transform='translate(0,-20)'
            fill='none'
            pointerEvents='all'
            onMouseLeave={() => setLineOpacity('0')}
            onMouseOver={() => setLineOpacity('1')}
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
