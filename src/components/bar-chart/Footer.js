import React from 'react';
import classNames from 'classnames';
import {
  showBarChart,
  showMonthOverview,
  showWeekdayOverview,
  showWeekOverview,
  onReset
} from '../../reducers/barChart';
import {selectDay} from '../../reducers/calendar';
import {connect} from 'react-redux';

const Footer = props => {
  const onCheckboxChange = () => {
    props.showWeekOverview(!props.isWeekOverviewChecked);
  };
  const onMonthCheckboxChange = () => {
    props.showMonthOverview(!props.isMonthOverviewChecked);
  };
  const onWeekdayCheckboxChange = () => {
    props.showWeekdayOverview(!props.isWeekdayOverviewChecked);
  };
  const onRemoveClick = () => {
    props.selectDay(null);
    props.onReset();
  };
  const renderCheckboxes = () =>
    <div className='checkboxes'>
       <span className={classNames('checkbox', {'bold': props.isWeekOverviewChecked})} onClick={onCheckboxChange}>
         Week overview <input type='checkbox' checked={props.isWeekOverviewChecked} defaultChecked={false} onChange={onCheckboxChange} />
       </span>
      <span className={classNames('checkbox', {'bold': props.isMonthOverviewChecked})} onClick={onMonthCheckboxChange}>
         Month overview <input type='checkbox' checked={props.isMonthOverviewChecked} defaultChecked={false} onChange={onMonthCheckboxChange} />
       </span>
      <span className={classNames('checkbox', {'bold': props.isWeekdayOverviewChecked})} onClick={onWeekdayCheckboxChange}>
         Weekdays <input type='checkbox' checked={props.isWeekdayOverviewChecked} defaultChecked={false} onChange={onWeekdayCheckboxChange} />
       </span>
    </div>;

  return (
    <div className='footer year-label'>
      { props.showFooter ? renderCheckboxes() : <div className='checkboxes'/> }
      <button onClick={onRemoveClick}>
        Remove charts
      </button>
    </div>
  )
};

const mapStateToProps = state => ({
  isWeekOverviewChecked: state.barChart.showWeekOverview,
  isMonthOverviewChecked: state.barChart.showMonthOverview,
  isWeekdayOverviewChecked: state.barChart.showWeekdayOverview
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val)),
  showWeekOverview: val => dispatch(showWeekOverview(val)),
  showMonthOverview: val => dispatch(showMonthOverview(val)),
  showWeekdayOverview: val => dispatch(showWeekdayOverview(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  onReset: val => dispatch(onReset(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
