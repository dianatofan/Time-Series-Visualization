import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './Calendar.css';
import * as d3 from 'd3';
import { withFauxDOM } from 'react-faux-dom';

class Calendar extends  Component {
  constructor (props) {
    super(props);
    this.renderD3 = this.renderD3.bind(this);
    this.updateD3 = this.updateD3.bind(this);
  }

  componentDidMount () {
    // this.renderD3();
  }

  // componentDidUpdate (prevProps, prevState) {
  //   // do not compare props.chart as it gets updated in updateD3()
  //   if (this.props.data !== prevProps.data) {
  //     this.updateD3()
  //   }
  // }

  // render () {
  //   return (
  //     <div>
  //       {this.props.calendar}
  //     </div>
  //   )
  // }

  static propTypes = {
    width: 500,
    height: 500
  };

  render() {
    return (
      <div id='calendar'>
        {this.drawCalendar(this.props.dataArr)}
      </div>
      )
  }

  drawCalendar(dateData) {
    const weeksInMonth = function(month){
      const m = d3.timeMonth.floor(month);
      return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
    };

    const minDate = d3.min(Object.keys(dateData), d => d);
    const maxDate = d3.max(Object.keys(dateData), d => d);

    const cellMargin = 2,
      cellSize = 20;

    const day = d3.timeFormat("%w"),
      week = d3.timeFormat("%U"),
      format = d3.timeFormat("%Y-%m-%d"),
      titleFormat = d3.utcFormat("%a, %d-%b");
    const monthName = d3.timeFormat("%B"),
      months = d3.timeMonth.range(d3.timeMonth.floor(new Date(minDate)), d3.timeMonth.ceil(new Date(maxDate)));

    debugger;

    const svg = d3.select("#calendar").selectAll("svg")
      .data(months)
      .enter().append("svg")
      .attr("class", "month")
      .attr("height", ((cellSize * 7) + (cellMargin * 8) + 20) ) // the 20 is for the month labels
      .attr("width", function(d) {
        const columns = weeksInMonth(d);
        return ((cellSize * columns) + (cellMargin * (columns + 1)));
      })
      .append("g");

    svg.append("text")
      .attr("class", "month-name")
      .attr("y", (cellSize * 7) + (cellMargin * 8) + 15 )
      .attr("x", function(d) {
        const columns = weeksInMonth(d);
        return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
      })
      .attr("text-anchor", "middle")
      .text(function(d) { return monthName(d); })



    // const rect = svg.selectAll("rect.day")
    //   .data(function(d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
    //   .enter().append("rect")
    //   .attr("class", "day")
    //   .attr("width", cellSize)
    //   .attr("height", cellSize)
    //   .attr("rx", 3).attr("ry", 3) // rounded corners
    //   .attr("fill", '#eaeaea') // default light grey fill
    //   .attr("y", function(d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
    //   .attr("x", function(d) { return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin ; })
    //   .on("mouseover", function(d) {
    //     d3.select(this).classed('hover', true);
    //   })
    //   .on("mouseout", function(d) {
    //     d3.select(this).classed('hover', false);
    //   })
    //   .datum(format);
    //
    // rect.append("title")
    //   .text(function(d) { return titleFormat(new Date(d)); });
    //
    // const lookup = d3.nest()
    //   .key(function(d) { return d.day; })
    //   .rollup(function(leaves) {
    //     return d3.sum(leaves, function(d){ return parseInt(d.count); });
    //   })
    //   .object(dateData);
    //
    // const scale = d3.scaleLinear()
    //   .domain(d3.extent(dateData, function(d) { return parseInt(d.count); }))
    //   .range([0.4,1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme
    //
    // rect.filter(function(d) { return d in lookup; })
    //   .style("fill", function(d) { return d3.interpolatePuBu(scale(lookup[d])); })
    //   .select("title")
    //   .text(function(d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });
  }

  drawLine() {
    var dataset = d3.range(21).map(function(d) { return {"y": d3.randomUniform(1)() } });
    console.log(dataset)

    let xScale = d3.scaleTime()
      .domain(d3.extent(dataset, ({date}) => date))
      .rangeRound([0, this.props.width]);

    let yScale = d3.scaleLinear()
      .domain(d3.extent(dataset, ({value}) => value))
      .rangeRound([this.props.height, 0]);

    let line = d3.line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d.y));

    return (
      <path
        className="line"
        d={line(dataset)}
      />
    );
  }

  renderD3 () {
    var data = this.props.data;
    const dataArr = this.props.dataArr;

    // This will create a faux div and store its virtual DOM in state.chart
    var faux = this.props.connectFauxDOM('div', 'calendar');

    /*
       D3 code below by Alan Smith, http://bl.ocks.org/alansmithy/e984477a741bc56db5a5
       The only changes made for this example are...
       1) feeding D3 the faux node created above
       2) calling this.animateFauxDOM(duration) after each animation kickoff
       3) move data generation and button code to parent component
       4) data and title provided as props by parent component
       5) reattach to faux dom for updates
       6) move rejoining of data and chart updates to updateD3()
       7) code update for D3 version 4
    */

    var xBuffer = 50;
    var yBuffer = 150;
    var lineLength = 400;

    var svgDoc = d3.select(faux).append('svg');

    var weeksInMonth = function(month){
      var m = d3.timeMonth.floor(month);
      return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
    };

    var minDate = d3.min(Object.keys(dataArr), d => d);
    var maxDate = d3.max(Object.keys(dataArr), d => d);

    var cellMargin = 2,
      cellSize = 20;

    var day = d3.timeFormat("%w"),
      week = d3.timeFormat("%U"),
      format = d3.timeFormat("%Y-%m-%d"),
      titleFormat = d3.utcFormat("%a, %d-%b");
    var monthName = d3.timeFormat("%B"),
      months= d3.timeMonth.range(d3.timeMonth.floor(new Date(minDate)), d3.timeMonth.ceil(new Date(maxDate)));

    var svg = svgDoc.selectAll("svg")
      .data(months)
      .enter().append("svg")
      .attr("class", "month")
      .attr("height", ((cellSize * 7) + (cellMargin * 8) + 20) ) // the 20 is for the month labels
      .attr("width", function(d) {
        var columns = weeksInMonth(d);
        return ((cellSize * columns) + (cellMargin * (columns + 1)));
      })
      .append("g");

    svgDoc.append("text")
      .data(months)
      .attr("class", "month-name")
      .attr("y", (cellSize * 7) + (cellMargin * 8) + 15 )
      .attr("x", function(d) {
        var columns = weeksInMonth(d);
        return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
      })
      .attr("text-anchor", "middle")
      .text(function(d) { return monthName(d); });

    var rect = svg.selectAll("rect.day")
      .data(function(d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
      .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("rx", 3).attr("ry", 3) // rounded corners
      .attr("fill", '#eaeaea') // default light grey fill
      .attr("y", function(d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
      .attr("x", function(d) { return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin ; })
      .on("mouseover", function(d) {
        d3.select(this).classed('hover', true);
      })
      .on("mouseout", function(d) {
        d3.select(this).classed('hover', false);
      })
      .datum(format);

    rect.append("title")
      .text(function(d) { return titleFormat(new Date(d)); });

    var lookup = d3.nest()
      .key(function(d) { return d.day; })
      .rollup(function(leaves) {
        return d3.sum(leaves, function(d){ return parseInt(d.count); });
      })
      .object(dataArr);


    var scale = d3.scaleLinear()
      .domain(d3.extent(dataArr, function(d) { return parseInt(d.count); }))
      .range([0.4,1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme

    rect.filter(function(d) { return d in lookup; })
      .style("fill", function(d) { return d3.interpolatePuBu(scale(lookup[d])); })
      .select("title")
      .text(function(d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });

    // svgDoc
    //   .append('text')
    //   .attr('x', xBuffer + lineLength / 2)
    //   .attr('y', 50)
    //   .text(this.props.title);
    //
    // // create axis line
    // svgDoc
    //   .append('line')
    //   .attr('x1', xBuffer)
    //   .attr('y1', yBuffer)
    //   .attr('x1', xBuffer + lineLength)
    //   .attr('y2', yBuffer);
    //
    // // create basic circles
    // svgDoc
    //   .append('g')
    //   .selectAll('circle')
    //   .data(data)
    //   .enter()
    //   .append('circle')
    //   .attr('cx', function (d, i) {
    //     var spacing = lineLength / data.length;
    //     return xBuffer + i * spacing
    //   })
    //   .attr('cy', yBuffer)
    //   .attr('r', function (d, i) {
    //     return d
    //   })
  }

  updateD3 () {
    var data = this.props.data;

    /* code below from Alan Smith except changes mentioned previously */

    var xBuffer = 50;
    var yBuffer = 150;
    var lineLength = 400;

    // reattach to faux dom
    var faux = this.props.connectFauxDOM('div', 'chart');
    var svgDoc = d3.select(faux).select('svg');

    // rejoin data
    var circle = svgDoc.select('g').selectAll('circle').data(data);

    circle.exit().remove(); // remove unneeded circles

    const getCx = function (d, i) {
      var spacing = lineLength / data.length;
      return xBuffer + i * spacing
    };
    // create any new circles needed
    const newCircles = circle
      .enter()
      .append('circle')
      .attr('cy', yBuffer)
      .attr('cx', getCx)
      .attr('r', 0);

    // update all circles to new positions
    newCircles
      .merge(circle)
      .transition()
      .duration(500)
      .attr('cx', getCx)
      .attr('r', function (d, i) {
        return d
      });

    this.props.animateFauxDOM(800);

    d3.select('text').text(this.props.title)
  }
}

Calendar.defaultProps = {
  chart: 'loading...'
};

Calendar.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default withFauxDOM(Calendar);
