import React from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import { getDayInsights } from '../helpers/parser';
import './Heatmap.css';

class Heatmap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showTooltip: false,
      renderBarChart: false,
      style: {}
    };
    this.renderChart = this.renderChart.bind(this);
  }

  render() {
    return (
      <div id='calendar'>
        { this.drawDayLabels() }
        {
          this.state.showTooltip &&
            <div className='tooltip' style={this.state.style}>
              {moment(this.state.showTooltip).format('dddd, MMMM DD YYYY')}
              <div className='text'>
                Count: {this.state.count}
              </div>
            </div>
        }
        <div className='months'>
          { this.drawCalendar(this.props.data) }
        </div>
      </div>
    );
  }

  renderChart(d) {
    const day = moment(d).format('YYYY-MM-DD');
    const dayInsights = getDayInsights(this.props.rawData);
    console.log(dayInsights[day]);
  }

  drawCalendar(dateData) {
    const weeksInMonth = month => {
      const m = d3.timeMonth.floor(month);
      return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
    };

    const minDate = d3.min(Object.keys(dateData));
    const maxDate = d3.max(Object.keys(dateData));

    const cellMargin = 4,
      cellSize = 16;

    const day = d => (d.getDay() + 6) % 7,
      week = d3.timeFormat('%W');
    const monthName = d3.timeFormat('%B'),
      // months = d3.timeMonth.range(d3.timeMonth.floor(new Date(`01-01-${minDate.split('-')[0]}`)),
      //   d3.timeMonth.ceil(new Date(`31-12-${maxDate.split('-')[0]}`)));
    months = d3.timeMonth.range(new Date(parseInt(`${minDate.split('-')[0]}`), 0, 1),
      new Date(parseInt(`${maxDate.split('-')[0]}`), 11, 31));

    const normalize = (val, max, min) => (1 - 0.25) * ((val - min) / (max - min)) + 0.25;

    return months.map(month => {
      const days = d3.timeDays(month, new Date(month.getFullYear(), month.getMonth()+1, 1));
      let filters = days.map(d =>
        Object.keys(dateData).find(key =>
          new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0))
      );
      const count = filters.map(i => !!i && dateData[i]).filter(j => !!j);
      return (
          <svg
            className='month'
            height={((cellSize * 7) + (cellMargin * 8) + 20)}
            width={(cellSize * weeksInMonth(month)) + (cellMargin * (weeksInMonth(month) + 1))}
            key={month}
          >
            <g>
              <text
                className='month-name'
                y={(cellSize * 7) + (cellMargin * 8) + 15}
                x={((cellSize * weeksInMonth(month)) + (cellMargin * (weeksInMonth(month) + 1))) / 2}
                textAnchor='middle'
              >
                {monthName(month)}
              </text>
              {
                days.map(d => {
                    const item = Object.keys(dateData).find(key =>
                      new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0));
                    const value = !!dateData[item] && normalize(dateData[item], Math.max(...count), Math.min(...count));
                    const fillColor = !!dateData[item] ? d3.interpolatePurples(value) : '#eaeaea';
                    return (
                    <rect
                      key={d}
                      className='day'
                      width={cellSize}
                      height={cellSize}
                      rx={50}
                      ry={50}
                      fill={fillColor}
                      y={(day(d) * cellSize) + (day(d) * cellMargin) + cellMargin}
                      x={((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin}
                      onMouseOver={(ev) => this.setState({
                        showTooltip: d,
                        count: !!dateData[item] ? dateData[item] : 0,
                        style: {
                          top: ev.clientY + 10,
                          left: ev.clientX + 10
                        }
                      })}
                      onMouseOut={() => this.setState({
                        showTooltip: false
                      })}
                      onClick={() => this.renderChart(d)}
                    >
                    </rect>
                  )
                }
                )
              }
            </g>
          </svg>
        );
      }
    );
  }

  drawDayLabels() {
    const weekArray = Array.apply(null, Array(7)).map(function (_, i) {
      return moment(i, 'e').startOf('week').isoWeekday(i+1).format('ddd');
    });
    return (<g>
      {
        weekArray.map(day =>
          <text
            key={day}
            className='dayLabels'
          >
            {day}
          </text>
        )
      }
    </g>);
  }
}

export default Heatmap;
