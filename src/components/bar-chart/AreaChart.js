import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import moment from 'moment';

class AreaChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circleHoverIndex: -1
    }
  }

  componentDidUpdate() {
    // let line = d3.selectAll('.line');
    // if (line.node()) {
    //   const totalLength = line.node().getTotalLength();
    //   line
    //     .attr('stroke-dasharray', totalLength)
    //     .attr('stroke-dashoffset', totalLength)
    //     .attr('stroke-width', 6)
    //     .attr('stroke', '#7888BF')
    //     .transition()
    //     .delay(1000)
    //     .duration(1000)
    //     .attr('stroke-width', 0)
    //     .attr('stroke-dashoffset', 0);
    // }
    // let area = d3.selectAll('.area');
    // area
    //   .attr('transform', 'translate(0,300)')
    //   .transition()
    //   .delay(1000)
    //   .duration(1000)
    //   .attr('transform', 'translate(0,0)');
    // let dots = d3.selectAll('.dot');
    // dots
    //   .attr('transform', 'translate(0,300)')
    //   .transition()
    //   .delay(2000)
    //   .duration(1000)
    //   .attr('transform', 'translate(0,0)')
  }

  render() {
    const { xScale, plotHeight, margin, yScale, selectedDay, occurrences, dayInsights, data } = this.props;

    const startDate = moment(selectedDay).isoWeekday(1);
    const endDate = moment(selectedDay).isoWeekday(8);
    let days = [];
    let day = startDate;
    while (day.isBefore(endDate)) {
      days.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
    const formattedDays = days.map(day => moment(day).format('YYYY-MM-DD'));
    const weekArray = Object.keys(data).filter(key => formattedDays.includes(key));
    let weekInsights = weekArray.reduce((acc, item) => {
      acc.push({ day: item, occurrences: dayInsights[item] });
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

    // define the area
    const area = d3.area()
      .x(d => xScale(d)+25)
      .y0(plotHeight - margin.top - margin.bottom)
      .y1(d => yScale(weekObj[d]))
      .curve(d3.curveCardinal);

    const valueline = d3.line()
      .x(d => xScale(d)+25)
      .y(d => yScale(weekObj[d]))
      .curve(d3.curveCardinal);

    return (
      <svg className='areaChart'>
        <defs>
          <linearGradient id="grad" is x1="0%" y1="100%" x2="0%" y2="0%" spreadMethod="pad">
            <stop offset="10%" stopColor="#fff" stopOpacity={.4}/>
            <stop offset="80%" stopColor="#7888BF" stopOpacity={.8}/>
          </linearGradient>
        </defs>
        <path className="area"
              fill="url(#grad)"
              d={area(Object.keys(weekObj))}
        />
        <path className="line shadow"
              d={valueline(Object.keys(weekObj))}
        />
        {
          Object.keys(weekObj).map((item, i) =>
            !!weekObj[item] &&
            <circle className='dot'
                    key={i}
                    r={5}
                    cx={xScale(item)+25}
                    cy={yScale(weekObj[item])}
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
      </svg>
    )
  }
}

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  data: state.app.data
});


export default connect(mapStateToProps)(AreaChart);
