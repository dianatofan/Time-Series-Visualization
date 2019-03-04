import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';

import Card from '../widget/Card';

import DayLabel from './DayLabel';
import Bars from './Bars';
import XAxis from './XAxis';
import YAxis from './YAxis';

import './BarChart.scss';

class BarChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      circleHoverIndex: -1,
      isChecked: false,
      width: document.getElementById('card').clientWidth - props.margin.left - props.margin.right
    };
    window.addEventListener("resize", this.resize().bind(this));
  }

  resize() {
    let t;

    return event => {
      if (t !== false) {
        clearTimeout(t);
      }
      t = setTimeout(() => {
        const state = Object.assign(this.state, {
          width: document.getElementById('card').clientWidth - this.props.margin.left - this.props.margin.right
        });
        this.setState(state);
      }, 100);
    };
  }

  updateScale = props => {
    const data = props.data;

    const xScale = d3.scaleBand();
    const yScale = d3.scaleLinear().nice();

    const xDomain = [...Array(24).keys()].map(key => key + 1);
    const yDomain = [0, d3.max(Object.values(data))];

    xScale
      .domain(xDomain)
      .range([0, this.state.width])
      .paddingInner(props.paddingInner)
      .paddingOuter(props.paddingOuter);

    yScale
      .domain(yDomain)
      .range([props.height - props.margin.top - props.margin.bottom, 0]);

    return {xScale, yScale};
  };

  updatePlotSize = props => {
    const plotWidth = this.state.width - (props.margin.left + props.margin.right);
    const plotHeight = props.height;
    return {plotWidth, plotHeight}
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  // renderAxis = nrOfTicks => {
  //   const xAxis = d3.axisBottom(this.state.xScale);
  //   const yAxis = d3.axisLeft(this.state.yScale).ticks(nrOfTicks).tickFormat(d3.format('d'));
  //   d3.select(this.refs.xAxis)
  //     .call(xAxis);
  //   d3.select(this.refs.yAxis)
  //     .call(yAxis);
  // };
  //
  // componentDidMount() {
  //   const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  //   const width = this.refs.barChart.clientWidth - margin.left - margin.right;
  //   const height = this.refs.barChart.clientHeight - margin.top - margin.bottom;
  //   const occurrences = this.props.allDays[this.props.selectedDay];
  //   const max = d3.max(Object.values(occurrences));
  //   const nrOfTicks = max < 10 ? max : max / 2;
  //   let obj = {};
  //   for (let i = 1; i <= 24; i++) {
  //     obj[i] = occurrences[i] || 0
  //   }
  //   this.setState({
  //     margin,
  //     width,
  //     height,
  //     xScale: d3.scaleBand().padding(0.1)
  //       .domain(Object.keys(obj))
  //       .range([0, width]),
  //     yScale: d3.scaleLinear()
  //       .domain([0, max])
  //       .range([height, 0])
  //   }, () => {
  //     this.renderAxis(nrOfTicks);
  //   });
  // }

  // componentDidUpdate() {
  //   this.renderAxis();
  //   ReactTooltip.rebuild();
  //   // let line = d3.selectAll('.line');
  //   // if (line.node()) {
  //   //   const totalLength = line.node().getTotalLength();
  //   //   line
  //   //     .attr('stroke-dasharray', totalLength)
  //   //     .attr('stroke-dashoffset', totalLength)
  //   //     .attr('stroke-width', 6)
  //   //     .attr('stroke', '#7888BF')
  //   //     .transition()
  //   //     .duration(3000)
  //   //     .attr('stroke-width', 0)
  //   //     .attr('stroke-dashoffset', 0);
  //   // }
  //   // let area = d3.selectAll('.area');
  //   // area
  //   //   .attr('transform', 'translate(0,300)')
  //   //   .transition()
  //   //   .duration(3000)
  //   //   .attr('transform', 'translate(0,0)')
  // }


  render() {
    // const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    //
    // const occurrences = this.props.allDays[this.props.selectedDay];
    //
    // const transform = `translate(${margin.left},${margin.top})`;
    //
    //
    // const svgHeight = 300;
    //
    // const startDate = moment(this.props.selectedDay).isoWeekday(1);
    // const endDate = moment(this.props.selectedDay).isoWeekday(8);
    // let days = [];
    // let day = startDate;
    // while (day.isBefore(endDate)) {
    //   days.push(day.toDate());
    //   day = day.clone().add(1, 'd');
    // }
    // const formattedDays = days.map(day => moment(day).format('YYYY-MM-DD'));
    //
    // const weekArray = Object.keys(this.props.data).filter(key => formattedDays.includes(key));
    // let weekInsights = weekArray.reduce((acc, item) => {
    //   acc.push({ day: item, occurrences: this.props.dayInsights[item] });
    //   return acc;
    // }, []);
    // weekInsights = weekInsights.map(week =>
    //   week.occurrences.map(item => {
    //     const m = moment(`${week.day} ${item}`);
    //     return m.minute() || m.second() || m.millisecond()
    //       ? parseInt(m.add(1, 'hour').startOf('hour').format('HH'))
    //       : parseInt(m.startOf('hour').format('HH'))
    //   })
    // );
    //
    // const weekOccurrences = [].concat.apply([], weekInsights).reduce((acc, item) => {
    //   acc[item] = (acc[item] || 0) + 1;
    //   return acc;
    // }, {});
    //
    // let weekObj = {};
    // for (let i = 1; i <= 24; i++) {
    //   weekObj[i] = weekOccurrences[i] ? Number(weekOccurrences[i]/7).toFixed(2) : 0
    // }
    //
    // const max = d3.max(Object.values(occurrences));
    //
    // let obj = {};
    // for (let i = 1; i <= 24; i++) {
    //   obj[i] = occurrences[i] || 0
    // }
    //
    // const xScale = d3.scaleBand().padding(0.1)
    //   .domain(Object.keys(obj))
    //   .range([0, this.state.width]);
    // const yScale = d3.scaleLinear()
    //   .domain([0, max])
    //   .range([this.state.height, 0]);
    //
    // // define the area
    // const area = d3.area()
    //   .x(function(d) { return xScale(d)+25; })
    //   .y0(svgHeight - margin.top - margin.bottom)
    //   .y1(function(d) { return yScale(weekObj[d]) || 0; })
    //   .curve(d3.curveCardinal);
    //
    // const valueline = d3.line()
    //   .x(function(d) { return xScale(d)+25; })
    //   .y(function(d) { return yScale(weekObj[d]); })
    //   .curve(d3.curveCardinal);
    //
    const onCheckboxChange = () => {
      this.setState({
        isChecked: !this.state.isChecked
      })
    };

    const { xScale, yScale } =  this.updateScale(this.props);
    const { plotWidth, plotHeight } = this.updatePlotSize(this.props);

    const max = d3.max(Object.values(this.props.data));
    const nrOfTicks = max < 10 ? max : max / 2;

    const metaData = {
      xScale,
      yScale,
      plotWidth,
      plotHeight,
      nrOfTicks
    };
    // const plotData = {
    //   plotData: this.props.data.map((d, i) => {
    //     return {
    //       id: i,
    //       data: d,
    //       x: xScale(this.props.xFn(d)),
    //       y: yScale(this.props.yFn(d)),
    //       width: xScale.bandwidth(),
    //       height: plotHeight - yScale(this.props.yFn(d))
    //     };
    //   })
    // };
    const transform = `translate(${this.props.margin.left},${this.props.margin.top})`;
    return (
      <Card>
        <DayLabel selectedDay={this.props.selectedDay} />
          /*
          <span className='checkbox' onClick={onCheckboxChange}>
            Show week overview <input type="checkbox" checked={this.state.isChecked} defaultChecked={false} onChange={onCheckboxChange}/>
          </span>
          */
        <div className='barChart'>
          <svg width='100%' height={this.props.height} ref='barChart'>
            <g transform={transform} width={plotWidth} height={plotHeight}>
              <XAxis {...metaData} transform={`translate(0,${plotHeight})`}/>
              <YAxis {...metaData} />
            </g>
          </svg>
          <ReactTooltip id='rectTooltip' multiline class='tooltipx'/>
        </div>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  selectedDay: moment(state.barChart.selectedDay).format('YYYY-MM-DD')
});

export default connect(mapStateToProps)(BarChart);

