import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xScale: null,
      yScale: null
    }
  }
  renderAxis = () => {
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
    if (!this.state.width) {
      this.setState({ width, height, xScale, yScale });
    }
  };

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  render() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

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
    let obj = {};
    for (let i = 1; i <= 24; i++) {
      obj[i] = occurrences[i] || 0
    }
    const transform = `translate(${margin.left},${margin.top})`;
    const timeFormat = d3.timeFormat('%H');
    const parseTime = d3.timeParse("%H:%M");

    const svgHeight = 300;

    return (
      <div className='container'>
        <div className='dayLabel'>
          { moment(this.props.selectedDay).format('dddd, MMMM DD YYYY') }
        </div>
        <div className='barChart'>
          <svg width='100%' height={svgHeight} ref='barChart'>
            <g transform={transform}>
              <g className='axis axis-x' transform={`translate(0,${svgHeight - 50})`} ref='xAxis' fill='none' fontSize={10} textAnchor='middle' />
              <g className='axis axis-y' ref='yAxis' />
              {
                this.state.width && Object.keys(occurrences).map(item => {
                  return (
                    <rect
                      className='bar'
                      x={this.state.xScale(parseTime(`${item}:00`))}
                      y={this.state.yScale(occurrences[item])}
                      width={this.state.width / 24 * 0.8}
                      height={this.state.height - this.state.yScale(occurrences[item])}
                      fill="#6595ec"
                    />
                  )
                }
                )
              }
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

