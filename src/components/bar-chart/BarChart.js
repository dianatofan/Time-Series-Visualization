import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';

import './BarChart.scss';

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverIndex: -1,
      circleHoverIndex: -1
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
    let obj = {};
    for (let i = 1; i <= 24; i++) {
      obj[i] = occurrences[i] || 0
    }
    const xScale = d3.scaleBand().padding(0.1)
      .domain(Object.keys(obj))
      .range([0, this.state.width]);
    const xAxis = d3.axisBottom(xScale);
    const yScale = d3.scaleLinear()
      .domain([0, max])
      .range([this.state.height, 0]);
    const yAxis = d3.axisLeft(yScale).ticks(nrOfTicks).tickFormat(d3.format('d'));
    d3.select(this.refs.xAxis)
      .call(xAxis);
    d3.select(this.refs.yAxis)
      .call(yAxis);
  };

  componentDidMount() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    this.setState({
      width: this.refs.barChart.clientWidth - margin.left - margin.right,
      height: this.refs.barChart.clientHeight - margin.top - margin.bottom
    }, () => {
      this.renderAxis();
    });
  }

  componentDidUpdate() {
    this.renderAxis();
    ReactTooltip.rebuild();
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


    const svgHeight = 300;

    const startDate = moment(this.props.selectedDay).isoWeekday(1);
    const endDate = moment(this.props.selectedDay).isoWeekday(8);
    let days = [];
    let day = startDate;
    while (day.isBefore(endDate)) {
      days.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
    const formattedDays = days.map(day => moment(day).format('YYYY-MM-DD'));

    const weekArray = Object.keys(this.props.data).filter(key => formattedDays.includes(key));
    let weekInsights = weekArray.reduce((acc, item) => {
      acc.push({ day: item, occurrences: this.props.dayInsights[item] });
      return acc;
    }, []);
    weekInsights = weekInsights.map(week =>
      week.occurrences.map(item => {
        const m = moment(`${week.day} ${item}`);
        return m.minute() || m.second() || m.millisecond()
          ? parseInt(m.add(1, 'hour').startOf('hour').format('HH'))
          : parseInt(m.startOf('hour').format('HH'))
      })
    );

    const weekOccurrences = [].concat.apply([], weekInsights).reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});

    let weekObj = {};
    for (let i = 1; i <= 24; i++) {
      weekObj[i] = weekOccurrences[i] ? Number(weekOccurrences[i]/7).toFixed(2) : 0
    }

    const max = d3.max(Object.values(occurrences));

    const xScale = d3.scaleBand().padding(0.1)
      .domain(Object.keys(obj))
      .range([0, this.state.width]);
    const yScale = d3.scaleLinear()
      .domain([0, max])
      .range([this.state.height, 0]);

    // define the area
    const area = d3.area()
      .x(function(d) { return xScale(d)+25; })
      .y0(svgHeight - margin.top - margin.bottom)
      .y1(function(d) { return yScale(weekObj[d]) || 0; })
      .curve(d3.curveCardinal);

    const valueline = d3.line()
      .x(function(d) { return xScale(d)+25; })
      .y(function(d) { return yScale(weekObj[d]); })
      .curve(d3.curveCardinal);

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
                Object.keys(occurrences).map((item, i) =>
                    <rect
                      className='bar'
                      x={xScale(item) || 0}
                      y={yScale(occurrences[item]) || 0}
                      width={xScale.bandwidth() || 0}
                      height={(this.state.height - yScale(occurrences[item])) || 0}
                      fill={`${i === this.state.hoverIndex ? "#5455D6" : "#6595ec"}`}
                      onMouseOver={() => this.setState({ hoverIndex: i })}
                      onMouseLeave={() => this.setState({ hoverIndex: -1 })}
                      data-tip={`Time - ${item}:00 <br> Occurrences - ${occurrences[item]}`}
                      data-for='rectTooltip'
                    />
                  )}
              <defs>
                <linearGradient id="grad" is x1="0%" y1="100%" x2="0%" y2="0%" spreadMethod="pad">
                  <stop offset="10%" stopColor="#fff" stopOpacity={.4}/>
                  <stop offset="80%" stopColor="#7888BF" stopOpacity={.8}/>
                </linearGradient>
              </defs>
              <path className="area"
                    fill="url(#grad)"
                    d={area(Object.keys(weekObj)) || 0}
              />
              <path className="line shadow"
                    d={valueline(Object.keys(weekObj)) || 0}
              />
              {
                Object.keys(weekObj).map((item, i) =>
                  !!weekObj[item] &&
                  <circle className='dot'
                          key={i}
                          r={5}
                          cx={xScale(item)+25 || 0}
                          cy={yScale(weekObj[item]) || 0}
                          data-key={item}
                          data-value={weekObj[item]}
                          data-tip={`${startDate.format('MMM DD')}-${endDate.format('MMM DD')} (Week ${startDate.week()})<br>Average observations at ${item}:00 --> ${weekObj[item]}`}
                          fill={`${i === this.state.circleHoverIndex ? "#7888BF" : "#fff"}`}
                          onMouseOver={() => this.setState({ circleHoverIndex: i })}
                          onMouseLeave={() => this.setState({ circleHoverIndex: -1 })}
                          data-for='rectTooltip'
                  />
                )
              }
                )
              }
            </g>
          </svg>
          <ReactTooltip id='rectTooltip' multiline class='tooltipx'/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  selectedDay: moment(state.barChart.selectedDay).format('YYYY-MM-DD'),
  data: state.app.data
});

export default connect(mapStateToProps)(BarChart);

