import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';

class BarChart extends React.Component {
  renderAxis = () => {
    let hours = [];
    for (let i = 0; i < 25; i++) {
      hours.unshift(moment().subtract(i, 'hours').format('hh'));
    }
    const dayInsights = this.props.dayInsights[this.props.selectedDay];
    const roundedHours = dayInsights && dayInsights.map(hour => {
        const m = moment(`${this.props.selectedDay} ${hour}`);
        return m.minute() || m.second() || m.millisecond()
          ? parseInt(m.add(1, 'hour').startOf('hour').format('HH'))
          : parseInt(m.startOf('hour').format('HH'))
      }
    );
    const occurrences = roundedHours && roundedHours.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
    const max = d3.max(Object.values(occurrences));
    const nrOfTicks = max < 10 ? max : max / 2;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = this.refs.barChart.clientWidth - margin.left - margin.right;
    const height = this.refs.barChart.clientHeight - margin.top - margin.bottom;
    const parseTime = d3.timeParse("%H:%M");
    const midnight = parseTime("00:00"); // "Mon, 01 Jan 1900 00:00:00 GMT"

    const xScale = d3.scaleTime()
      .domain([midnight, d3.timeDay.offset(midnight, 1)])
      .range([0, width]);
    const xAxis = d3.axisBottom(xScale).ticks(24).tickFormat(d3.timeFormat('%H'));
    const yScale = d3.scaleLinear()
      .domain([0, max])
      .range([height, 0]);
    const yAxis = d3.axisLeft(yScale).ticks(max).tickFormat(d3.format('d'));
    d3.select(this.refs.xAxis)
      .call(xAxis);
    d3.select(this.refs.yAxis)
      .call(yAxis);
  };

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  render() {
    // let hours = [...Array(24)];
    // hours = hours.map((hour, i) => moment().subtract(i, 'hours').format('HH'));
    let hours = [];
    for (let i = 0; i < 25; i++) {
      hours.unshift(moment().subtract(i, 'hours').format('HH'));
    }
    const margin = { top: 20, right: 20, bottom: 30, left: 40 },
      x = d3.scaleBand().padding(0.1),
      y = d3.scaleLinear();
    const transform = `translate(${margin.left},${margin.top})`;
    return (
      <div className='container'>
        <div className='dayLabel'>
          { moment(this.props.selectedDay).format('dddd, MMMM DD YYYY') }
        </div>
        <div className='barChart'>
          <svg width='100%' height={500} ref='barChart'>
            <g transform={transform}>
              <g className='axis axis-x' transform='translate(0,450)' ref='xAxis' fill='none' fontSize={10} textAnchor='middle' />
              <g className='axis axis-y' ref='yAxis' />
             </g>
          </svg>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  selectedDay: moment(state.barChart.selectedDay).format('YYYY-MM-DD')
});

export default connect(mapStateToProps)(BarChart);

