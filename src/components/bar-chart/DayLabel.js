import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import {selectDay, showBarChart} from '../../reducers/barChart';
import {showEmptyContainer} from "../../reducers/app";

class DayLabel extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selectedDay !== this.props.selectedDay;
  }

  render() {
    const { selectedDay, minDate, maxDate, selectDay, dayInsights, showBarChart, showEmptyContainer } = this.props;
    const previousDay = moment(selectedDay).subtract(1, 'days');
    const nextDay = moment(selectedDay).add(1, 'days');
    const showPreviousArrow = previousDay.isAfter(minDate.startOf('year'));
    const showNextArrow = nextDay.isBefore(maxDate.endOf('year'));
    const pickDay = day => {
      selectDay(day);
      if (!!dayInsights[day.format('YYYY-MM-DD')]) {
        showEmptyContainer(false);
        showBarChart(true);
      } else {
        showEmptyContainer(true);
        showBarChart(false);
      }
    };
    return (
      <div className='yearLabel dayTitle'
           tabIndex={0}
           onKeyDown={ev => {
             if (ev) {
               if (ev.key === 'ArrowLeft') {
                 pickDay(moment(selectedDay).add(-1, 'days'));
               }
               if (ev.key === 'ArrowRight') {
                 pickDay(moment(selectedDay).add(1, 'days'));
               }
             }
      }}>
        <i
          className={classNames('fas fa-chevron-left', {'disabled': !showPreviousArrow})}
          onClick={() => {showPreviousArrow && selectDay(moment(selectedDay).add(-1, 'days'))}}
        />
        { moment(selectedDay).format('dddd, MMMM DD YYYY') }
        <i
          className={classNames('fas fa-chevron-right', {'disabled': !showNextArrow})}
          onClick={() => showNextArrow && selectDay(moment(selectedDay).add(1, 'days'))}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  minDate: state.app.minDate,
  maxDate: state.app.maxDate,
  selectedDay: state.barChart.selectedDay,
  dayInsights: state.app.dayInsights
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  showEmptyContainer: val => dispatch(showEmptyContainer(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(DayLabel);
