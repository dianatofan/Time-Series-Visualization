import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import {selectDay, showBarChart} from '../../reducers/barChart';
import {setMonthInsights} from '../../reducers/app';
import { getMonthInsights } from '../../helpers/parser';

class DayLabel extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selectedDay !== this.props.selectedDay ||
      nextProps.selectedMonth !== this.props.selectedMonth;
  }

  render() {
    const { minDate, maxDate, selectDay, showBarChart, setMonthInsights, selectedMonth, selectedDay, dayInsights, allDays } = this.props;
    const selectedItem = selectedMonth || selectedDay;
    const unit = selectedMonth ? 'months' : 'days';
    const previousItem = selectedMonth ? selectedMonth-1 : moment(selectedItem).subtract(1, unit);
    const nextItem = selectedMonth ? parseInt(selectedMonth)+1 : moment(selectedItem).add(1, unit);
    const showPreviousArrow = selectedMonth ? moment(previousItem, 'M').isAfter(minDate.startOf('year')) : previousItem.isAfter(minDate.startOf('year'));
    const showNextArrow = selectedMonth ? true : nextItem.isBefore(maxDate.endOf('year'));
    const pickDay = day => {
      setMonthInsights({
        monthInsights: [],
        daysOfMonth: [],
        selectedMonth: null
      });
      selectDay(day);
      showBarChart(true);
    };
    const pickMonth = month => {
      selectDay(null);
      const monthInsights = getMonthInsights(month.toString(), dayInsights, allDays);
      setMonthInsights({
        selectedMonth: monthInsights.selectedMonth,
        daysOfMonth: monthInsights.daysOfMonth,
        monthInsights: monthInsights.monthInsights
      });
      showBarChart(true);
    };
    return (
      <div className='yearLabel dayTitle'
           tabIndex={0}
           onKeyDown={ev => {
             if (ev) {
               if (ev.key === 'ArrowLeft') {
                 !selectedMonth ? pickDay(moment(selectedItem).add(-1, unit)) : pickMonth(selectedItem - 1)
               }
               if (ev.key === 'ArrowRight') {
                 !selectedMonth ? pickDay(moment(selectedItem).add(1, unit)) : pickMonth(parseInt(selectedItem) + 1)
               }
             }
      }}>
        <i
          className={classNames('fas fa-chevron-left', {'disabled': !showPreviousArrow})}
          onClick={() => {showPreviousArrow && selectDay(moment(selectedItem).add(-1, unit))}}
        />
        {
          !!selectedMonth
          ? moment(selectedMonth, 'M').format('MMMM')
          : moment(selectedItem).format('dddd, MMMM DD YYYY')
        }
        <i
          className={classNames('fas fa-chevron-right', {'disabled': !showNextArrow})}
          onClick={() => showNextArrow && selectDay(moment(selectedItem).add(1, unit))}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  minDate: state.app.minDate,
  maxDate: state.app.maxDate,
  selectedDay: state.barChart.selectedDay,
  selectedMonth: state.app.selectedMonth,
  dayInsights: state.app.dayInsights,
  allDays: state.app.allDays
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(DayLabel);
