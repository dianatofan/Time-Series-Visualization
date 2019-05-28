import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import * as d3 from 'd3';
import {getCurrentMonthInsights, getCurrentWeekInsights, getWeekdayInsights, getShiftSelectionInsights} from '../../helpers/parser';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Bars from './Bars';
import AreaChart from './AreaChart';
import Modal from '../widget/Modal';
import { showBarChart, showMonthOverview, showWeekdayOverview, showWeekOverview } from '../../reducers/barChart';
import {saveColor} from '../../reducers/calendar';
import ReactTooltip from 'react-tooltip';
import Footer from './Footer';
import {getAverageColor} from "../../helpers/colors";

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: (document.getElementById('card').clientWidth - props.margin.left - props.margin.right) * 0.66
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

  getData = () => {
    if (!!this.props.weekInsights.length) {
      return this.props.daysOfWeek;
    }
    if (!!this.props.monthInsights.length) {
      return this.props.daysOfMonth;
    }
    if (!!this.props.weekdayInsights.length) {
      return this.props.daysOfWeekday;
    }
    return this.props.plotData;
  };

  getInsights = () => {
    if (this.props.isWeekOverviewChecked) {
      return getCurrentWeekInsights(this.props.data, this.props.selectedDay, this.props.dayInsights);
    }
    if (this.props.isMonthOverviewChecked) {
      return getCurrentMonthInsights(this.props.data, this.props.selectedDay, this.props.dayInsights);
    }
    if (this.props.isWeekdayOverviewChecked) {
      return getWeekdayInsights(moment(this.props.selectedDay).format('ddd'), this.props.dayInsights, this.props.allDays, this.props.currentWeekdays, this.props.data).weekdayObj;
    }
    if (!!this.props.shiftSelection.length) {
      return getShiftSelectionInsights(this.props.shiftSelection, this.props.data, this.props.dayInsights, this.props.allDays).selectedDaysObj
    }
  };

  showAreaChart = () => this.props.isWeekOverviewChecked || this.props.isMonthOverviewChecked || this.props.isWeekdayOverviewChecked || !!this.props.shiftSelection.length;

  updateScale = data => {
    const xScale = d3.scaleTime();
    const xScaleArea = d3.scaleTime();
    const yScale = d3.scaleLinear().nice();

    const insights = this.getInsights();

    const max = insights ?
      Math.ceil(Math.max(d3.max(Object.values(insights).map(i => parseInt(i))), d3.max(Object.values(data).map(i => parseInt(i))))) :
      d3.max(Object.values(data));

    const yDomain = [0, this.showAreaChart() ? max + max / 20 : max];

    const parseTime = d3.timeParse('%H:%M');
    const midnight = parseTime('00:00');

    xScale
      .domain([midnight, d3.timeDay.offset(midnight)])
      .range([0, this.state.width - this.props.margin.right]);

    xScaleArea
      .domain([midnight, d3.timeDay.offset(midnight)])
      .range([0, this.state.width - this.props.margin.right]);

    yScale
      .domain(yDomain)
      .range([this.props.height - this.props.margin.top - this.props.margin.bottom, 0]);

    return {xScale, yScale, xScaleArea};
  };

  updatePlotSize = () => {
    const plotWidth = this.state.width - (this.props.margin.left + this.props.margin.right);
    const plotHeight = this.props.height;
    return {plotWidth, plotHeight}
  };

  render() {
    const data = this.getData();

    const { xScale, yScale, xScaleArea } =  this.updateScale(data);
    const { plotWidth, plotHeight } = this.updatePlotSize();

    const max = d3.max(Object.values(data));
    const nrOfTicks = max < 10 ? max : (max > 20 ? max / 4 : max / 2);

    const parseTime = d3.timeParse('%H');

    const metaData = {
      xScale,
      yScale,
      xScaleArea,
      plotWidth,
      plotHeight,
      nrOfTicks
    };
    const plotData = {
      plotData: Object.keys(data).map((item, i) => ({
        id: i,
        data: item,
        x: xScale(parseTime(item)),
        y: yScale(data[item]),
        width: ((this.state.width - this.props.margin.right) / 24) * 0.8,
        height: plotHeight - yScale(data[item]) - this.props.margin.top - this.props.margin.bottom,
        occurrences: data[item]
      }))
    };

    const transform = `translate(${this.props.margin.left},${this.props.margin.top})`;
    const color = this.props.color || getAverageColor(this.props);

    return (
      <div>
        <svg width='100%' height={this.props.height} ref='barChart'>
          <g transform={transform} width={plotWidth} height={plotHeight}>
            <XAxis {...metaData} transform={`translate(0,${plotHeight - 50})`}/>
            <YAxis {...metaData} />
            <Bars {...metaData} {...plotData} color={color}/>
            {this.showAreaChart() &&
            <AreaChart {...metaData} {...plotData} margin={this.props.margin} insights={this.getInsights()} color={color}/>}
          </g>
        </svg>
        <Footer />
        <ReactTooltip id='rectTooltip' multiline class='tooltip'/>
        <Modal />
      </div>
    )
  }
}
const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  weekInsights: state.app.weekInsights,
  monthInsights: state.app.monthInsights,
  weekdayInsights: state.app.weekdayInsights,
  daysOfWeek: state.app.daysOfWeek,
  daysOfMonth: state.app.daysOfMonth,
  daysOfWeekday: state.app.daysOfWeekday,
  selectedWeek: state.app.selectedWeek,
  selectedDay: moment(state.calendar.selectedDay).format('YYYY-MM-DD'),
  selectedMonth: state.app.selectedMonth,
  selectedWeekday: state.app.selectedWeekday,
  shiftSelection: state.app.shiftSelection,
  selectedDays: state.app.selectedDays,
  data: state.app.data,
  allDays: state.app.allDays,
  minDate: state.app.minDate,
  currentWeekdays: state.calendar.currentWeekdays,
  isWeekOverviewChecked: state.barChart.showWeekOverview,
  isMonthOverviewChecked: state.barChart.showMonthOverview,
  isWeekdayOverviewChecked: state.barChart.showWeekdayOverview,
  color: state.calendar.color,
  colors: state.calendar.colors
});

const mapDispatchToProps = dispatch => ({
  showWeekOverview: val => dispatch(showWeekOverview(val)),
  showMonthOverview: val => dispatch(showMonthOverview(val)),
  showWeekdayOverview: val => dispatch(showWeekdayOverview(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  saveColor: val => dispatch(saveColor(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(BarChart);
