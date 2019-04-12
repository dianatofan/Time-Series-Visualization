import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';

import Card from '../widget/Card';

import DayLabel from './DayLabel';
import Bars from './Bars';
import XAxis from './XAxis';
import YAxis from './YAxis';
import AreaChart from './AreaChart';

import './BarChart.scss';
import {selectDay, showWeekOverview, showMonthOverview, showWeekdayOverview, showBarChart} from "../../reducers/barChart";
import {getCurrentWeekInsights, getCurrentMonthInsights, getWeekdayInsights} from "../../helpers/parser";

class BarChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      circleHoverIndex: -1,
      isWeekOverviewChecked: false,
      isMonthOverviewChecked: false,
      isWeekdayOverviewChecked: false,
      width: document.getElementById('card').clientWidth - props.margin.left - props.margin.right
    };
  }

  componentWillMount() {
    this.resize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize());
  }

  resize = () => {
    let t;

    return event => {
      if (t !== false) {
        clearTimeout(t);
      }
      t = setTimeout(() => {
        const state = Object.assign(this.state, {
          width: document.getElementById('card').clientWidth - this.props.margin.left - this.props.margin.right
        });
        this.setState(state);
      }, 100);
    };
  };

  updateScale = (props, data) => {
    const xScale = d3.scaleBand();
    const newXScale = d3.scaleLinear();
    const yScale = d3.scaleLinear().nice();

    const currentWeekInsights = this.state.isWeekOverviewChecked && getCurrentWeekInsights(this.props.dataArr, this.props.selectedDay, this.props.dayInsights);

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

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const showBarChart = !!this.props.dayInsights[this.props.selectedDay] ||
      !!this.props.monthInsights.length ||
      !!this.props.weekdayInsights.length;

    const renderBarChart = () => {
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

      const currentWeekInsights = this.state.isWeekOverviewChecked && getCurrentWeekInsights(this.props.dataArr, this.props.selectedDay, this.props.dayInsights);
      const currentMonthInsights = this.state.isMonthOverviewChecked && getCurrentMonthInsights(this.props.dataArr, this.props.selectedDay, this.props.dayInsights);
      const currentWeekdayInsights = this.state.isWeekdayOverviewChecked && getWeekdayInsights(moment(this.props.selectedDay).format('ddd'), this.props.dayInsights, this.props.allDays, this.props.currentWeekdays, this.props.dataArr);

      let insights;
      if (this.state.isWeekOverviewChecked) {
        insights = currentWeekInsights;
      }
      if (this.state.isMonthOverviewChecked) {
        insights = currentMonthInsights;
      }
      if (this.state.isWeekdayOverviewChecked) {
        insights = currentWeekdayInsights.weekdayObj;
      }
      return (
        <svg width='100%' height={this.props.height} ref='barChart'>
          <g transform={transform} width={plotWidth} height={plotHeight}>
            <XAxis {...metaData} transform={`translate(0,${plotHeight})`}/>
            <YAxis {...metaData} />
            <Bars {...metaData} {...plotData} />
            {
              (this.state.isWeekOverviewChecked || this.state.isMonthOverviewChecked || this.state.isWeekdayOverviewChecked) &&
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
      )
    };

    const renderFooter = () => {
      const onCheckboxChange = () => {
        this.setState({
          isWeekOverviewChecked: !this.state.isWeekOverviewChecked,
          isMonthOverviewChecked: false,
          isWeekdayOverviewChecked: false
        }, () => {
          this.props.showWeekOverview(this.state.isWeekOverviewChecked);
          this.props.showMonthOverview(false);
          this.props.showWeekdayOverview(false);
        });
      };
      const onMonthCheckboxChange = () => {
        this.setState({
          isMonthOverviewChecked: !this.state.isMonthOverviewChecked,
          isWeekOverviewChecked: false,
          isWeekdayOverviewChecked: false
        }, () => {
          this.props.showMonthOverview(this.state.isMonthOverviewChecked);
          this.props.showWeekOverview(false);
          this.props.showWeekdayOverview(false);
        });
      };
      const onWeekdayCheckboxChange = () => {
        this.setState({
          isWeekdayOverviewChecked: !this.state.isWeekdayOverviewChecked,
          isMonthOverviewChecked: false,
          isWeekOverviewChecked: false
        }, () => {
          this.props.showWeekdayOverview(this.state.isWeekdayOverviewChecked);
          this.props.showMonthOverview(false);
          this.props.showWeekOverview(false);
        });
      };
      const onRemoveClick = () => {
        this.props.showBarChart(false);
        this.props.selectDay(null);
        this.props.showWeekOverview(false);
        this.props.showMonthOverview(false);
        this.props.showWeekdayOverview(false);
      };
      return (
        <div className='footer yearLabel'>
          <div className='checkboxes'>
           <span className={classNames('checkbox', {'bold': this.state.isWeekOverviewChecked})} onClick={onCheckboxChange}>
             Week overview <input type='checkbox' checked={this.state.isWeekOverviewChecked} defaultChecked={false} onChange={onCheckboxChange} />
           </span>
            <span className={classNames('checkbox', {'bold': this.state.isMonthOverviewChecked})} onClick={onMonthCheckboxChange}>
             Month overview <input type='checkbox' checked={this.state.isMonthOverviewChecked} defaultChecked={false} onChange={onMonthCheckboxChange} />
           </span>
            <span className={classNames('checkbox', {'bold': this.state.isWeekdayOverviewChecked})} onClick={onWeekdayCheckboxChange}>
             Weekdays <input type='checkbox' checked={this.state.isWeekdayOverviewChecked} defaultChecked={false} onChange={onWeekdayCheckboxChange} />
           </span>
          </div>
          <button onClick={onRemoveClick}>
            Remove charts
          </button>
        </div>
      )
    };

    return (
      <Card>
        <DayLabel selectedDay={this.props.selectedDay} />
        <div className='barChart'>
            {
              showBarChart
              ? renderBarChart()
              : <div className='emptyString'>No data recorded</div>
            }
          { showBarChart && <ReactTooltip id='rectTooltip' multiline class='tooltipx'/> }
        </div>
        { showBarChart &&  renderFooter() }
      </Card>
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
  currentWeekdays: state.barChart.currentWeekdays
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val)),
  showWeekOverview: val => dispatch(showWeekOverview(val)),
  showMonthOverview: val => dispatch(showMonthOverview(val)),
  showWeekdayOverview: val => dispatch(showWeekdayOverview(val)),
  showBarChart: val => dispatch(showBarChart(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(BarChart);
