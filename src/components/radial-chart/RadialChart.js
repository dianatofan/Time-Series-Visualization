// import React from 'react';
// import { connect } from 'react-redux';
// import moment from 'moment';
// import * as d3 from 'd3';
//
// import ButterflyChart from '../butterfly-chart/ButterflyChart';
//
// const RadialChart = props => {
//   const dayInsights = props.dayInsights[props.selectedDay];
//
//   console.log(dayInsights);
//
//   const width = 960,
//     height = 600,
//     barHeight = height / 2 - 40;
//   const color = d3.scaleOrdinal()
//     .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);
//
//   const formatNumber = d3.format("s");
//
//   // const extent = dayInsights && d3.extent(dayInsights, function(d) { return d; });
//   // const barScale = extent && d3.scaleLinear()
//   //   .domain(extent)
//   //   .range([0, barHeight]);
//   //
//   // // const numBars = dayInsights && dayInsights.length;
//   //
//   // const x = extent && d3.scaleLinear()
//   //   .domain(extent)
//   //   .range([0, -barHeight]);
//   //
//   // const xAxis = d3.axisLeft()
//   //   .ticks(3)
//   //   .tickFormat(formatNumber);
//
//   const transform = "translate(" + width/2 + "," + height/2 + ")";
//
//   const arc = d3.arc()
//     .startAngle((d, i) => (i * 2 * Math.PI) / numBars)
//     .endAngle((d, i) => ((i + 1) * 2 * Math.PI) / numBars)
//     .innerRadius(0);
//
//   const roundedHours = dayInsights && dayInsights.map(hour => {
//     const m = moment(`${props.selectedDay} ${hour}`);
//       return m.minute() || m.second() || m.millisecond()
//         ? parseInt(m.add(1, 'hour').startOf('hour').format('HH'))
//         : parseInt(m.startOf('hour').toString().format('HH'))
//     }
//   );
//
//   const occurrences = roundedHours && roundedHours.reduce((acc, item) => {
//     acc[item] = (acc[item] || 0) + 1;
//     return acc;
//   }, {});
//
//   const keys = [...Array(24).keys()];
//
//   const labelRadius = barHeight * 1.025;
//   // const d = "m0 " + "-" + labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0";
//   const d = `m0 -${labelRadius} a${labelRadius} ${labelRadius} 0 1,1 -0.01 0`;
//    const temp = [...Array(12).keys()];
//    const obj = {
//      0: 4,
//      1: 10,
//      2: 3,
//      3: 0,
//      4: 0,
//      5: 5,
//      6: 1,
//      7: 8,
//      8: 9,
//      9: 0,
//      10: 0,
//      11: 2
//    };
//    const numBars = 12;
//   //
//   //  const extent = d3.extent(Object.values(occurrences), d => d);
//   //
//   // const barScale = extent && d3.scaleLinear()
//   //   .domain(extent)
//   //   .range([0, barHeight]);
//   //
//   // // const numBars = dayInsights && dayInsights.length;
//   //
//   // const x = extent && d3.scaleLinear()
//   //   .domain(extent)
//   //   .range([0, -barHeight]);
//   //
//   // const xAxis = d3.axisLeft()
//   //   .ticks(3)
//   //   .tickFormat(formatNumber);
//
//   return (
//     dayInsights ? <ButterflyChart /> :
//       <div className='container'>
//         <div className='dayLabel'>
//           { moment(props.selectedDay).format('dddd, MMMM DD YYYY') }
//         </div>
//         <span className='noDataRecorded'>
//           No data recorded
//         </span>
//       </div>
//   )
// };
//
// const mapStateToProps = state => ({
//   dayInsights: state.app.dayInsights,
//   selectedDay: state.radialChart.selectedDay
// });
//
// export default connect(mapStateToProps)(RadialChart);
