// import React from 'react';
// import moment from "moment";
// import * as d3 from "d3";
// import classNames from "classnames";
//
// const Day = props => {
//   const cellMargin = props.cellMargin,
//     cellSize = props.cellSize;
//   let isCurrentDay = false;
//   if (moment(d).format('DD-MM-YY') === moment().format('DD-MM-YY')) {
//     isCurrentDay = true;
//   }
//
//   const day = d => (d.getDay() + 6) % 7,
//     week = d3.timeFormat('%W');
//
//   const normalize = (val, max, min) => (1 - 0.25) * ((val - min) / (max - min)) + 0.25;
//
//   const month = props.month;
//   const dateData = props.data;
//
//   const days = d3.timeDays(month, new Date(month.getFullYear(), month.getMonth()+1, 1));
//   let filters = days.map(d =>
//     Object.keys(dateData).find(key =>
//       new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0))
//   );
//   const count = filters.map(i => !!i && dateData[i]).filter(j => !!j);
//
//   const item = Object.keys(dateData).find(key =>
//     new Date(key).setHours(0,0,0,0) === d.setHours(0,0,0,0));
//   const value = !!dateData[item] && normalize(dateData[item], Math.max(...count), Math.min(...count));
//   const fillColor = !!dateData[item] ? d3.interpolatePurples(value) : '#ececec';
//   return (
//     <rect
//       key={d}
//       className={classNames('day', {'current-day': isCurrentDay})}
//       width={cellSize}
//       height={cellSize}
//       rx={50}
//       ry={50}
//       fill={fillColor}
//       y={(day(d) * cellSize) + (day(d) * cellMargin) + cellMargin}
//       x={((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin}
//       onMouseOver={(ev) => this.setState({
//         showTooltip: d,
//         count: !!dateData[item] ? dateData[item] : 0,
//         style: {
//           top: ev.clientY + 10,
//           left: ev.clientX + 10
//         }
//       })}
//       onMouseOut={() => this.setState({
//         showTooltip: false
//       })}
//       onClick={() => this.renderChart(d)}
//     >
//     </rect>
//   )
// };
//
// export default Day;
