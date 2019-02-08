import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';
import Tooltip from "../calendar/Tooltip";

class ButterflyChart extends React.Component {
  constructor(props) {
    super(props);
    this.renderAxis = this.renderAxis.bind(this);
  }

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
    ReactTooltip.rebuild();
  }

  renderAxis() {
    const dayInsights = this.props.dayInsights[this.props.selectedDay];
    const roundedHours = dayInsights && dayInsights.map(hour => {
        const m = moment(`${this.props.selectedDay} ${hour}`);
        return m.minute() || m.second() || m.millisecond()
          ? parseInt(m.add(1, 'hour').startOf('hour').format('HH'))
          : parseInt(m.startOf('hour').format('HH'))
      }
    );
    const occurrences = roundedHours.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});

    const HEIGHT = 300, WIDTH = 800, LABEL_WIDTH = 50;
    const max = d3.max(Object.values(occurrences));
    const nrOfTicks = max < 10 ? max : max / 2;
    const dayScale = d3.scaleLinear()
      .domain([0, max])
      .range([ 0, (WIDTH - LABEL_WIDTH) / 2 ]),
    nightScale = d3.scaleLinear()
      .domain([0, max])
      .range([ 0, -(WIDTH - LABEL_WIDTH) / 2 ]),
    dayAxis = d3.axisTop(dayScale).tickSize(-HEIGHT, 0, 0).ticks(nrOfTicks).tickFormat(d3.format('d')),
    nightAxis = d3.axisTop(nightScale).tickSize(-HEIGHT, 0, 0).ticks(nrOfTicks).tickFormat(d3.format('d'));

    d3.select(this.refs.dayAxis)
      .call(dayAxis);

    d3.select(this.refs.nightAxis)
      .call(nightAxis);
  }

  render() {
    const dayInsights = this.props.dayInsights[this.props.selectedDay];
    const roundedHours = dayInsights && dayInsights.map(hour => {
        const m = moment(`${this.props.selectedDay} ${hour}`);
        return m.minute() || m.second() || m.millisecond()
          ? parseInt(m.add(1, 'hour').startOf('hour').format('HH'))
          : parseInt(m.startOf('hour').format('HH'))
      }
    );
    const occurrences = roundedHours.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});

    let obj = {};
    for (let i = 1; i <= 24; i++) {
      obj[i] = occurrences[i] || 0
    }

    var WIDTH = 800, HEIGHT = 300;

    var ROW_HEIGHT = 20, LABEL_WIDTH = 50, MARGIN_TOP = 25;

    // var sizeFn = absoluteSize;

    var entries = null;

    const max = d3.max(Object.values(occurrences));

    const dayScale = d3.scaleLinear()
        .domain([0, max])
        .range([ 0, (WIDTH - LABEL_WIDTH) / 2 ]),
      nightScale = d3.scaleLinear()
        .domain([0, max])
        .range([ 0, -(WIDTH - LABEL_WIDTH) / 2 ]);

    const arr = Object.keys(obj).slice(12,24);

    return (
      <div className='container'>
        <div className='dayLabel'>
          { moment(this.props.selectedDay).format('dddd, MMMM DD YYYY') }
        </div>
        <div className='butterflyChart'>
          <svg
            width={WIDTH + 20}
            height={HEIGHT}
          >
            <g className='axis'
               transform={`translate(${LABEL_WIDTH + (WIDTH - LABEL_WIDTH) / 2},${MARGIN_TOP - 1})`}
               ref='dayAxis'
            >
            </g>
            <g className='axis'
               transform={`translate(${LABEL_WIDTH + (WIDTH - LABEL_WIDTH) / 2},${MARGIN_TOP - 1})`}
               ref='nightAxis'
            >
            </g>
            <text y={`${MARGIN_TOP - 3}`} dx={0} className='axisLabel'>
              Hour
            </text>
            <text x={LABEL_WIDTH} y={`${MARGIN_TOP + 14}`} fill='#FFBC14'>
              PM
            </text>
            <text x={WIDTH} y={`${MARGIN_TOP + 14}`} fill='#537AFF' textAnchor='end'>
              AM
            </text>
            {
                Object.keys(obj).slice(0, 12).map((item, i) => {
                  return (
                    <g
                      className='row'
                      transform={`translate(${LABEL_WIDTH + (WIDTH - LABEL_WIDTH) / 2},${MARGIN_TOP + i * ROW_HEIGHT})`}
                    >
                      <text
                        dx={10}
                        className='label'
                        fill='#777'
                        transform={`translate(${-(WIDTH - LABEL_WIDTH) / 2 - LABEL_WIDTH},${ROW_HEIGHT}) scale(.85)`}
                      >
                        {item}
                      </text>
                      <rect
                        data-tip={`Time: ${item}`}
                        data-for='svgTooltip'
                        className='night'
                        fill='#537AFF'
                        height={`${ROW_HEIGHT - .5}`}
                        width={`${dayScale(obj[item])}`}
                        x={0}
                        rx={10}
                      >
                      </rect>
                      {/*<path fill='#537AFF' d={rightRoundedRect(0, 0, dayScale(obj[item]), ROW_HEIGHT - .5, 20)} />*/}
                      {/*<path fill='#FFBC14' d={leftRoundedRect(nightScale(obj[arr[i]]), 0, -nightScale(obj[arr[i]]), ROW_HEIGHT - .5, 20)} />*/}
                      <rect
                        data-tip={`Time: ${i}`}
                        data-for='svgTooltip'
                        className='day'
                        fill='#FFBC14'
                        height={`${ROW_HEIGHT - .5}`}
                        width={`${-nightScale(obj[arr[i]])}`}
                        x={`${nightScale(obj[arr[i]])}`}
                        rx={10}
                      >
                      </rect>
                    </g>
                  )
              })
            }
          </svg>
          <ReactTooltip id='svgTooltip'/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  selectedDay: state.radialChart.selectedDay
});

export default connect(mapStateToProps)(ButterflyChart);
