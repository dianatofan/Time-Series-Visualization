import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import moment from 'moment';
import {openModal} from "../../reducers/barChart";

class AreaChart extends React.Component {
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
    const { xScaleArea, yScale, plotHeight, color, plotData, openModal, dayInsights, selectedDay } = this.props;

    const getPosition = i => {
      const lines = document.getElementsByClassName('line');
      let pos;

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

      d3.select('.line-text')
        .text(Number(yScale.invert(pos.y)).toFixed(2));

      return pos;
    };

    d3.select('.mouse-line')
      .attr('d', function() {
        let d = 'M' + mouseX + ',' + (plotHeight - 50);
        d += ' ' + mouseX + ',' + 0;
        return d;
      });

    const formatTime = d3.timeFormat('%H');
    const parseTime = d3.timeParse('%H');

    d3.selectAll('.mouse-per-line')
      .attr('transform', function(d, i) {
        const pos = getPosition(i);
        const x = xScaleArea.invert(pos.x);

        d3.selectAll('.bar')
          .attr('fill', d =>  formatTime(parseTime(d.data)) === formatTime(x) ? d3.rgb(color).darker() : color);

        return 'translate(' + mouseX + ',' + pos.y +')';
      });

    const hide = () => {
      d3.select('.bar-text')
        .style('opacity', 0);
      d3.select('.bar-circle')
        .style('opacity', 0);
    };

    d3.selectAll('.mouse-per-bar')
      .attr('transform', function(d, i) {

        const bars = plotData.map(i => moment(i.data, 'H').format('HH'));

        const x = xScaleArea.invert(getPosition(i).x);

        if (bars.indexOf(formatTime(x)) > -1) {
          const item = plotData.find(i => moment(i.data, 'H').format('HH') === formatTime(x));
          d3.select('.mouse-over-effects')
            .style('cursor', 'pointer')
            .on('click', () => {
              openModal({ data: item, arr: dayInsights[moment(selectedDay).format('YYYY-MM-DD')] });
              hide();
            });

          d3.select('.bar-text')
            .style('opacity', 1)
            .text(item.occurrences);
          d3.select('.bar-circle')
            .style('opacity', 1);
          return `translate(${mouseX},${item.y - 3.8})`
        }
        d3.select('.mouse-over-effects')
          .style('cursor', 'auto')
          .on('click', null);
        hide();
      });
  };

  setLineOpacity = val => {
    d3.select('.mouse-line')
      .style('opacity', val);
    d3.selectAll('.mouse-per-line .line-circle')
      .style('opacity', val);
    d3.selectAll('.mouse-per-line .line-text')
      .style('opacity', val);
  };

  render() {
    const { xScaleArea, plotWidth, plotHeight, margin, yScale, insights } = this.props;

    const parseTime = d3.timeParse('%H:%M');

    const area = d3.area()
      .x(d => xScaleArea(parseTime(`${d}:30`)))
      .y0(plotHeight - margin.top - margin.bottom)
      .y1(d => yScale(insights[d]))
      .curve(d3.curveMonotoneX);

    const line = d3.line()
      .x(d => xScaleArea(parseTime(`${d}:30`)))
      .y(d => yScale(insights[d]))
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
              d={area(Object.keys(insights))}
        />
        <path className='line shadow'
              d={line(Object.keys(insights))}
        />
        <g className='mouse-over-effects'>
          <path
            className='mouse-line'
            stroke='#777'
            strokeWidth={1}
            strokeDasharray='3,3'
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
            transform='translate(0,0)'
            fill='none'
            pointerEvents='all'
            onMouseLeave={() => this.setLineOpacity('0')}
            onMouseOver={() => this.setLineOpacity('1')}
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

const mapDispatchToProps = dispatch => ({
  openModal: val => dispatch(openModal(val))
});


export default connect(mapStateToProps, mapDispatchToProps)(AreaChart);
