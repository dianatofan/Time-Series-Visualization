import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import {selectDay, showBarChart} from '../../reducers/barChart';
import {setMonthInsights, setWeekdayInsights} from '../../reducers/app';
import { getMonthInsights } from '../../helpers/parser';

class DayLabel extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selectedDay !== this.props.selectedDay ||
      nextProps.selectedMonth !== this.props.selectedMonth ||
      nextProps.selectedWeekday !== this.props.selectedWeekday;
  }

  render() {
    const { minDate, maxDate, selectDay, showBarChart, setMonthInsights, setWeekdayInsights,
      selectedMonth, selectedDay, dayInsights, allDays, selectedWeekday } = this.props;
    const selectedItem = selectedMonth || selectedWeekday || selectedDay;
    let unit = '';
    if (selectedMonth) {
      unit = 'months';
    } else if (selectedWeekday) {
      unit = 'weeks';
    } else {
      unit = 'days';
    }
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
      setWeekdayInsights({
        selectedWeekday: null,
        daysOfWeekday: [],
        weekdayInsights: []
      });
      selectDay(day);
      showBarChart(true);
    };
    const pickMonth = month => {
      selectDay(null);
      setWeekdayInsights({
        selectedWeekday: null,
        daysOfWeekday: [],
        weekdayInsights: []
      });
      const monthInsights = getMonthInsights(month.toString(), dayInsights, allDays);
      setMonthInsights({
        selectedMonth: monthInsights.selectedMonth,
        daysOfMonth: monthInsights.daysOfMonth,
        monthInsights: monthInsights.monthInsights
      });
      showBarChart(true);
    };
    let string = '';
    if (selectedMonth) {
      string = moment(selectedMonth, 'M').format('MMMM');
    } else if (selectedWeekday) {
      string = `${moment(selectedWeekday, 'ddd').format('dddd')}s`;
    } else {
      string = moment(selectedItem).format('dddd, MMMM DD YYYY');
    }

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
        { string }
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
  selectedWeekday: state.app.selectedWeekday,
  dayInsights: state.app.dayInsights,
  allDays: state.app.allDays
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(DayLabel);
