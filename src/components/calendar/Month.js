// import React from 'react';
// import * as d3 from "d3";
// import moment from 'moment';
//
// const Month = props => {
//   const month = props.month;
//
//   const weeksInMonth = month => {
//     const m = d3.timeMonth.floor(month);
//     return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
//   };
//
//   const cellMargin = this.state.cellMargin,
//     cellSize = this.state.cellSize;
//
//   const monthName = d3.timeFormat('%B');
//   const yearName = d3.timeFormat('%Y');
//
//   const days = d3.timeDays(month, new Date(month.getFullYear(), month.getMonth()+1, 1));
//   const lastDay = moment(month).endOf('month').format('ddd'); // last day of current month
//   const firstDay = moment(month).add(1, 'months').startOf('month').format('ddd'); // first day of next month
//   let extraSpace = 0;
//   if ((lastDay === 'Mon' && firstDay === 'Tue') || (lastDay === 'Tue' && firstDay === 'Wed')) {
//     extraSpace += 10;
//   }
//
//   return (
//     <svg
//       className='month'
//       height={((cellSize * 7) + (cellMargin * 8) + 20)}
//       width={(cellSize * weeksInMonth(month)) + (cellMargin * (weeksInMonth(month) + 5)) + extraSpace}
//       key={month}
//     >
//       <g>
//         <text
//           className='month-name'
//           y={(cellSize * 7) + (cellMargin * 8) + 15}
//           x={((cellSize * weeksInMonth(month)) + (cellMargin * (weeksInMonth(month) + 1))) / 2}
//           textAnchor='middle'
//         >
//           { monthName(month) }
//         </text>
//         { days.map(d => props.renderDay(d, month, props.data)) }
//       </g>
//     </svg>
//   )
// };
//
// export default Month;