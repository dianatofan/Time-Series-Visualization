import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';

import {setWeekdayInsights, setMonthInsights, onShiftClick, resetShiftSelection, removeItem} from '../../reducers/app';
import { showBarChart } from '../../reducers/barChart';
import { selectDay } from '../../reducers/calendar';
import { getWeekdayInsights } from '../../helpers/parser';

class DayLabels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false
    };
  }

  onWeekdayClick = (ev, day) => {
    if (ev.shiftKey) {
      this.setState({
        toggle: !this.state.toggle
      });
      this.state.toggle ? this.props.onShiftClick(day) : this.props.removeItem(day);
    } else {
      this.props.selectDay(null);
      this.props.resetShiftSelection();
      this.props.setMonthInsights({
        monthInsights: [],
        daysOfMonth: []
      });
      const weekdayInsights = getWeekdayInsights(day, this.props.dayInsights, this.props.allDays);
      this.props.setWeekdayInsights({
        selectedWeekday: weekdayInsights.selectedWeekday,
        daysOfWeekday: weekdayInsights.daysOfWeekday,
        weekdayInsights: weekdayInsights.weekdayInsights
      });
      this.props.showBarChart(true);
      this.setState({
        toggle: false
      });
    }
  };

  render() {
    const weekArray = Array.apply(null, Array(7)).map(function (_, i) {
      return moment(i, 'e').startOf('week').isoWeekday(i+1).format('ddd');
    });

    return (
      <div className='day-labels-container'>
        {
          weekArray.map(day =>
            <text
              key={day}
              className={classNames('day-labels', {'bold': this.props.selectedWeekday === day || this.props.shiftSelection.indexOf(day) > -1 || this.props.shiftSelection.indexOf('all') > -1})}
              onClick={ev => this.onWeekdayClick(ev, day)}
            >
              {day}
            </text>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allDays: state.app.allDays,
  dayInsights: state.app.dayInsights,
  selectedWeekday: state.app.selectedWeekday,
  shiftSelection: state.app.shiftSelection
});

const mapDispatchToProps = dispatch => ({
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  selectDay: val => dispatch(selectDay(val)),
  onShiftClick: val => dispatch(onShiftClick(val)),
  resetShiftSelection: val => dispatch(resetShiftSelection(val)),
  removeItem: val => dispatch(removeItem(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(DayLabels);
