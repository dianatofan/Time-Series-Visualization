import React from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import moment from 'moment';

import { setWeekdayInsights } from '../../reducers/app';
import { highlightDay } from '../../reducers/radialChart';
import {getWeekdayInsights} from '../../helpers/parser';
import {showBarChart} from '../../reducers/barChart';
import {selectDay} from '../../reducers/calendar';

import './RadialChart.scss';

class RadialChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    }
  }

  componentDidMount() {
    this.renderArcs();
  }

  componentDidUpdate() {
    this.renderArcs();
  }

  normalize = val => {
    const max = Math.max(...Object.values(this.props.data));
    const min = Math.min(...Object.values(this.props.data));
    return (1 - 0.25) * ((val - min) / (max - min)) + 0.25;
  };

  getPercentage = val => {
    const max = Math.max(...Object.values(this.props.data));
    const min = Math.min(...Object.values(this.props.data));
    return (80 - 5) * ((val - min) / (max - min)) + 5;
  };

  renderArcs = () => {
    const svg = d3.select(this.refs.radialChart);

    const { setWeekdayInsights, highlightDay, dayInsights, allDays, showBarChart } = this.props;

    const width = 350;
    const arcSize = (5 * width / 100);
    const innerRadius = arcSize * 2;

    const keysArray = Object.keys(this.props.data)
      .sort((a, b) => moment(a, 'ddd').isoWeekday() - moment(b, 'ddd').isoWeekday());

    const data = keysArray.map(key => {
      return {
        defaultValue: this.props.data[key],
        value: this.getPercentage(this.props.data[key]),
        label: key,
        color: d3.interpolateBlues(this.normalize(this.props.data[key]))
      }
    });

    const arcs = data.map((obj, i) => {
      return d3.arc().innerRadius(i * arcSize + innerRadius).outerRadius((i + 1) * arcSize - (width / 100) + innerRadius);
    });

    const arcsGrey = data.map(function (obj, i) {
      return d3.arc().innerRadius(i * arcSize + (innerRadius + ((arcSize / 2) - 2))).outerRadius((i + 1) * arcSize - ((arcSize / 2)) + (innerRadius));
    });

    const pieData = data.map(function (obj, i) {
      return [
        {value: obj.value * 0.75, arc: arcs[i], object: obj},
        {value: (100 - obj.value) * 0.75, arc: arcsGrey[i], object: obj},
        {value: 100 * 0.25, arc: arcs[i], object: obj}];
    });

    const pie = d3.pie()
      .sort(null)
      .value(d => d.value);

    const g = svg.selectAll('g').data(pieData)
      .enter()
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + width / 2 + ') rotate(180)');

    const gText = svg.selectAll('g.textClass').data([{}]).enter()
      .append('g')
      .classed('textClass', true)
      .attr('transform', 'translate(' + width / 2 + ',' + width / 2 + ') rotate(180)');

    g.selectAll('path').data(function (d) {
      return pie(d);
    })
      .enter()
      .append('path')
      .attr('id', function (d, i) {
        if (i === 0) {
          return 'Arc' + d.data.object.label;
        }
        if (i === 1) {
          return 'Text' + d.data.object.label;
        }
      })
      .style('cursor', 'pointer')
      .on('click', function (d, i) {
        const weekdayInsights = getWeekdayInsights(d.data.object.label, dayInsights, allDays);
        setWeekdayInsights({
          selectedWeekday: weekdayInsights.selectedWeekday,
          daysOfWeekday: weekdayInsights.daysOfWeekday,
          weekdayInsights: weekdayInsights.weekdayInsights
        });
        showBarChart(true);
        selectDay(null);
      })
      .on('mouseover', function (d, i) {
        if (i === 0) {
          const id = d3.select(this).attr('id');
          d3.selectAll('.radial-chart path')
            .transition()
            .filter(function () {
              return d3.select(this).attr('id') !== id;
            })
            .duration(500)
            . attr('opacity', function (d, j) {
              return j !== i - 1 ? 0.1 : 1;
            });

          d3.selectAll('.textClass text')
            .transition()
            .filter(function () {
              return d3.select(this).text() !== d.data.object.label;
            })
            .duration(500)
            . attr('opacity', function (d, j) {
              return j !== i - 1 ? 0.1 : 1;
            });

          d3.selectAll('.textpath')
            .transition()
            .filter(function () {
              return d3.select(this).text() !== d.data.object.value;
            })
            .duration(500)
            . attr('opacity', function (d, j) {
              return j !== i - 1 ? 0.1 : 1;
            });
          highlightDay(d.data.object.label);
        }
      })
      .on('mouseleave', (d, i) => {
        d3.selectAll('.radial-chart path').attr('opacity', 1);
        d3.selectAll('.textClass text').attr('opacity', 1);
        d3.selectAll('.textpath').attr('opacity', 1);
        highlightDay(null);
      })
      .attr('fill', (d, i) => i === 0 ? d.data.object.color : i === 1 ? '#F1F1F1' : 'none')
      .transition()
      .duration(1000)
        .attrTween('d', function (d) {
          const i = d3.interpolate(d.startAngle+0.1, d.endAngle);
          return function(t) {
            d.endAngle = i(t);
            return d.data.arc(d);
          }
      });

    svg.selectAll('g').each(function (d, index) {
      const el = d3.select(this);
      el.selectAll('path').each(function (r, i) {
        if (i === 1) {
          const labelObj = r.data.object;
          g.append('text')
            .attr('font-size', ((4 * width) / 100))
            .attr('fill', '#777')
            .attr('dominant-baseline', 'central')
            .append('textPath')
            .attr('class', 'textpath')
            .attr('textLength', function (d, i) {
              return 0;
            })
            .attr('xlink:href', '#Text' + labelObj.label)
            .attr('startOffset', '5')
            .attr('dy', '-3em')
            .transition()
            .delay(1000)
              .text(labelObj.defaultValue);
        }
        if (i === 0) {
          const centroidText = r.data.arc.centroid({
            startAngle: r.startAngle,
            endAngle: r.startAngle
          });
          const labelObj = r.data.object;
          gText.append('text')
            .attr('font-size', ((4 * width) / 100))
            .attr('fill', () => labelObj.color)
            .attr('font-weight', '600')
            .transition()
            .delay(1000)
              .text(labelObj.label)
            .attr('transform', 'translate(' + (centroidText[0] - ((1.5 * width) / 100)) + ',' + (centroidText[1] + ') rotate(' + (180) + ')'))
            .attr('dominant-baseline', 'central');
        }
      })
    });
  };

  render() {
    return (
      <svg className='radial-chart' ref='radialChart' width='100%' height={350} />
    )
  }
}

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  allDays: state.app.allDays,
  selectedDay: moment(state.calendar.selectedDay).format('YYYY-MM-DD'),
  highlightedWeekday: state.radialChart.highlightedWeekday
});

const mapDispatchToProps = dispatch => ({
  highlightDay: val => dispatch(highlightDay(val)),
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  selectDay: val => dispatch(selectDay(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(RadialChart);
