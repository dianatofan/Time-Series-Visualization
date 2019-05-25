import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Card from '../widget/Card';
import Section from '../widget/Section';

import DayLabel from './DayLabel';
import BarChart from './BarChart';

import './BarChart.scss';

const Container = props => {
  const showBarChart = !!props.dayInsights[props.selectedDay] ||
    !!props.monthInsights.length ||
    !!props.weekdayInsights.length;

  const barChartProps = {
    plotData: props.data,
    margin: props.margin,
    height: props.height
  };

  return (
    <Section className={classNames({'section-one-third': props.showDatasetOverview, 'section-two-thirds': !props.showDatasetOverview})}>
      <Card>
        {
          props.showDatasetOverview ?
          <div className='year-label dayTitle dataset-overview-title'>Weekdays vs. weekends</div> :
          <DayLabel selectedDay={props.selectedDay} />
        }
        <div className='barChart'>
          {
            showBarChart
              ? <BarChart {...barChartProps} showDatasetOverview={props.showDatasetOverview} />
              : <div className='emptyString'>No data recorded</div>
          }
        </div>
      </Card>
    </Section>
  )
};

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  monthInsights: state.app.monthInsights,
  weekdayInsights: state.app.weekdayInsights,
  selectedDay: moment(state.calendar.selectedDay).format('YYYY-MM-DD')
});

export default connect(mapStateToProps)(Container);
