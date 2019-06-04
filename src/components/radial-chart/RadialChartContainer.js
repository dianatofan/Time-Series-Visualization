import React from 'react';
import { connect } from 'react-redux';

import Card from '../widget/Card';
import Section from '../widget/Section';

import '../bar-chart/BarChart.scss';
import RadialChart from "./RadialChart";
import { getDatasetOverview} from "../../helpers/parser";

const RadialChartContainer = props => {
  const getInsights = () => getDatasetOverview(props.allDays, props.data, props.dayInsights);

  return (
    <Section className='section-one-third'>
      <Card className='radial-chart-container'>
        <div className='year-label dayTitle dataset-overview-title'>Week average</div>
        <div>
          <RadialChart data={getInsights()} />
        </div>
      </Card>
    </Section>
  )
};

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  data: state.app.data,
  allDays: state.app.allDays
});

export default connect(mapStateToProps)(RadialChartContainer);
