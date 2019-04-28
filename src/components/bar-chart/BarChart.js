import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import * as d3 from 'd3';
import {getCurrentMonthInsights, getCurrentWeekInsights, getWeekdayInsights} from '../../helpers/parser';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Bars from './Bars';
import AreaChart from './AreaChart';
import {
  selectDay,
  showBarChart,
  showMonthOverview,
  showWeekdayOverview,
  showWeekOverview
} from '../../reducers/barChart';
import ReactTooltip from 'react-tooltip';
import Footer from './Footer';

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: document.getElementById('card').clientWidth - props.margin.left - props.margin.right
    };
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.resize());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.resize());
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  resize = () => {
    this.setState({
      width: document.getElementById('card').clientWidth - this.props.margin.left - this.props.margin.right
    });
  };

  updateScale = (props, data) => {
    const xScale = d3.scaleBand();
    const newXScale = d3.scaleLinear();
    const yScale = d3.scaleLinear().nice();

    const currentWeekInsights = this.props.isWeekOverviewChecked && getCurrentWeekInsights(this.props.dataArr, this.props.selectedDay, this.props.dayInsights);

    const max = currentWeekInsights ?
      Math.ceil(Math.max(d3.max(Object.values(currentWeekInsights)), d3.max(Object.values(data)))) :
      d3.max(Object.values(data));

    const xDomain = [...Array(24).keys()];
    const yDomain = [0, max];

    xScale
      .domain(xDomain)
      .range([0, this.state.width - props.margin.right])
      .paddingInner(props.paddingInner)
      .paddingOuter(props.paddingOuter);

    newXScale
      .domain([0, 23])
      .range([0, this.state.width - props.margin.right]);

    yScale
      .domain(yDomain)
      .range([props.height - props.margin.top - props.margin.bottom, 0]);

    return {xScale, yScale, newXScale};
  };

  updatePlotSize = props => {
    const plotWidth = this.state.width - (props.margin.left + props.margin.right);
    const plotHeight = props.height;
    return {plotWidth, plotHeight}
  };

  render() {
    let data = [];
    if (!!this.props.monthInsights.length) {
      data = this.props.daysOfMonth;
    } else if (!!this.props.weekdayInsights.length) {
      data = this.props.daysOfWeekday;
    } else {
      data = this.props.data;
    }
    const { xScale, yScale, newXScale } =  this.updateScale(this.props, data);
    const { plotWidth, plotHeight } = this.updatePlotSize(this.props);

    const max = d3.max(Object.values(data));
    const nrOfTicks = max < 10 ? max : max / 2;

    const metaData = {
      xScale,
      yScale,
      plotWidth,
      plotHeight,
      nrOfTicks
    };
    const plotData = {
      plotData: Object.keys(data).map((item, i) => ({
        id: i,
        data: item,
        x: xScale(item),
        y: yScale(data[item]),
        width: xScale.bandwidth(),
        height: plotHeight - yScale(data[item]) - this.props.margin.top - this.props.margin.bottom,
        occurrences: data[item]
      }))
    };
    const transform = `translate(${this.props.margin.left},${this.props.margin.top})`;

    const currentWeekInsights = this.props.isWeekOverviewChecked && getCurrentWeekInsights(this.props.dataArr, this.props.selectedDay, this.props.dayInsights);
    const currentMonthInsights = this.props.isMonthOverviewChecked && getCurrentMonthInsights(this.props.dataArr, this.props.selectedDay, this.props.dayInsights);
    const currentWeekdayInsights = this.props.isWeekdayOverviewChecked && getWeekdayInsights(moment(this.props.selectedDay).format('ddd'), this.props.dayInsights, this.props.allDays, this.props.currentWeekdays, this.props.dataArr);

    let insights;
    if (this.props.isWeekOverviewChecked) {
      insights = currentWeekInsights;
    }
    if (this.props.isMonthOverviewChecked) {
      insights = currentMonthInsights;
    }
    if (this.props.isWeekdayOverviewChecked) {
      insights = currentWeekdayInsights.weekdayObj;
    }

    const showAreaChart = this.props.isWeekOverviewChecked || this.props.isMonthOverviewChecked || this.props.isWeekdayOverviewChecked;

    return (
      <div>
        <svg width='100%' height={this.props.height} ref='barChart'>
          <g transform={transform} width={plotWidth} height={plotHeight}>
            <XAxis {...metaData} transform={`translate(0,${plotHeight-50})`}/>
            <YAxis {...metaData} />
            <Bars {...metaData} {...plotData} />
            {
              showAreaChart &&
              <AreaChart
                xScale={newXScale}
                yScale={yScale}
                plotWidth={plotWidth}
                plotHeight={plotHeight}
                margin={this.props.margin}
                weekInsights={insights}
                occurrences={data}
                transform={transform}
              />
            }
          </g>
        </svg>
        <Footer />
        <ReactTooltip id='rectTooltip' multiline class='tooltip'/>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  monthInsights: state.app.monthInsights,
  weekdayInsights: state.app.weekdayInsights,
  daysOfMonth: state.app.daysOfMonth,
  daysOfWeekday: state.app.daysOfWeekday,
  selectedDay: moment(state.barChart.selectedDay).format('YYYY-MM-DD'),
  dataArr: state.app.data,
  allDays: state.app.allDays,
  currentWeekdays: state.barChart.currentWeekdays,
  isWeekOverviewChecked: state.barChart.showWeekOverview,
  isMonthOverviewChecked: state.barChart.showMonthOverview,
  isWeekdayOverviewChecked: state.barChart.showWeekdayOverview
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val)),
  showWeekOverview: val => dispatch(showWeekOverview(val)),
  showMonthOverview: val => dispatch(showMonthOverview(val)),
  showWeekdayOverview: val => dispatch(showWeekdayOverview(val)),
  showBarChart: val => dispatch(showBarChart(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(BarChart);
