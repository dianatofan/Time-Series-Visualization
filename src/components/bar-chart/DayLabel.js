import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import {showBarChart} from '../../reducers/barChart';
import {saveColor, selectDay} from '../../reducers/calendar';
import {setMonthInsights, setWeekdayInsights, setWeekInsights} from '../../reducers/app';
import {select} from '../../helpers/navigator';

class DayLabel extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selectedDay !== this.props.selectedDay ||
      nextProps.selectedMonth !== this.props.selectedMonth ||
      nextProps.selectedWeek !== this.props.selectedWeek ||
      nextProps.selectedWeekday !== this.props.selectedWeekday;
  }

  getUnit = () => {
    if (this.props.selectedMonth) {
      return 'months';
    } else if (this.props.selectedWeekday || this.props.selectedWeek) {
      return 'weeks';
    } else {
      return 'days';
    }
  };

  getString = selectedItem => {
    if (this.props.selectedMonth) {
      return moment(this.props.selectedMonth, 'M').format('MMMM');
    } else if (this.props.selectedWeek) {
      return `Week ${this.props.selectedWeek}`;
    } else if (this.props.selectedWeekday) {
      return `${moment(this.props.selectedWeekday, 'ddd').format('dddd')}s`;
    } else {
      return moment(selectedItem).format('dddd, MMMM DD YYYY');
    }
  };

  showArrows = (selectedItem, unit, minDate, maxDate) => {
    if (selectedItem) {
      const previousItem = moment(selectedItem).subtract(1, unit);
      const nextItem = moment(selectedItem).add(1, unit);
      const prev = previousItem.format(`${moment(minDate).year()}-MM-DD`);
      const min = minDate.startOf('year').format('YYYY-MM-DD');
      const next = nextItem.format(`${moment(maxDate).year()}-MM-DD`);
      const max = maxDate.startOf('year').format('YYYY-MM-DD');
      return {
        previous: moment(prev).isSameOrAfter(moment(min)),
        next: moment(next).isSameOrBefore(moment(max))
      }
    }
  };

  render() {
    const { minDate, maxDate, selectedMonth, selectedDay, selectedWeekday, selectedWeek } = this.props;
    const selectedItem = selectedMonth || selectedWeekday || selectedDay || selectedWeek;
    const unit = this.getUnit();

    const showArrows = this.showArrows(selectedItem, unit, minDate, maxDate);
    const showPreviousArrow = showArrows && showArrows.previous;
    const showNextArrow = showArrows && showArrows.next;

    return (
      <div className='year-label dayTitle'
           tabIndex={0}>
        <i
          className={classNames('fas fa-chevron-left', {'disabled': !showPreviousArrow})}
          onClick={() => showPreviousArrow && select(-1, this.props)}
        />
        { this.getString(selectedItem) }
        <i
          className={classNames('fas fa-chevron-right', {'disabled': !showNextArrow})}
          onClick={() => showNextArrow && select(1, this.props)}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  minDate: state.app.minDate,
  maxDate: state.app.maxDate,
  selectedDay: state.calendar.selectedDay,
  selectedWeek: state.app.selectedWeek,
  selectedMonth: state.app.selectedMonth,
  selectedWeekday: state.app.selectedWeekday,
  dayInsights: state.app.dayInsights,
  allDays: state.app.allDays,
  colors: state.calendar.colors,
  currentWeekdays: state.calendar.currentWeekdays,
  data: state.app.data
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  setWeekInsights: val => dispatch(setWeekInsights(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  saveColor: val => dispatch(saveColor(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(DayLabel);
