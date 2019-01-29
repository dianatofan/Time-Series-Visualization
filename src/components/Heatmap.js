import React from 'react';
import * as d3 from "d3";
import moment from 'moment';
import classNames from 'classnames';

class Heatmap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showTooltip: false,
      style: {}
    };
  }

  render() {
    return (
      <div id="calendar">
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

  drawCalendar(dateData) {
    const weeksInMonth = function(month){
      const m = d3.timeMonth.floor(month);
      return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
    };

    const minDate = d3.min(Object.keys(dateData));
    const maxDate = d3.max(Object.keys(dateData));

    const cellMargin = 4,
      cellSize = 18;

    const day = d3.timeFormat("%w"),
      week = d3.timeFormat("%U"),
      format = d3.timeFormat("%Y-%m-%d"),
      titleFormat = d3.timeFormat("%a, %d-%b");
    const monthName = d3.timeFormat("%B"),
      months = d3.timeMonth.range(d3.timeMonth.floor(new Date(minDate)), d3.timeMonth.ceil(new Date));

    const scale = d3.scaleLinear()
      .domain(d3.extent(dateData, function(d) { console.log(d); return parseInt(d.count); }))
      .range([0.4,1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest par

    const lookup = d3.nest()
      .key(function(d) { return d.day; })
      .rollup(function(leaves) {
        return d3.sum(leaves, function(d){ console.log(d);return parseInt(d.count); });
      })
      .object(dateData);

    const normalize = (val, max, min) => (1 - 0.25) * ((val - min) / (max - min)) + 0.25;

    return months.map(month => {
      const days = d3.timeDays(month, new Date(month.getFullYear(), month.getMonth()+1, 1));
      let filters = days.map(d => {
        return Object.keys(dateData).find(key =>
          new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0));
      });
      const count = filters.map(i => !!i && dateData[i]).filter(j => !!j);

      return (
          <svg
            className="month"
            height={((cellSize * 7) + (cellMargin * 8) + 20)}
            width={(cellSize * weeksInMonth(month)) + (cellMargin * (weeksInMonth(month) + 1))}
            key={month}
          >
            <g>
              <text
                className="month-name"
                y={(cellSize * 7) + (cellMargin * 8) + 15}
                x={((cellSize * weeksInMonth(month)) + (cellMargin * (weeksInMonth(month) + 1))) / 2}
                textAnchor="middle"
              >
                {monthName(month)}
              </text>
              {
                days.map(d => {
                    const item = Object.keys(dateData).find(key =>
                      new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0));
                    const value = !!dateData[item] && normalize(dateData[item], Math.max(...count), Math.min(...count));
                    const fillColor = !!dateData[item] ? d3.interpolatePurples(value) : "#eaeaea";
                    return (
                    <rect
                      key={d}
                      className="day"
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
      return moment(i, 'e').startOf('week').isoWeekday(i).format('ddd');
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
