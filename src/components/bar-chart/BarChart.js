import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import * as d3 from 'd3';
import {getCurrentMonthInsights, getCurrentWeekInsights, getWeekdayInsights} from '../../helpers/parser';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Bars from './Bars';
import AreaChart from './AreaChart';
import Modal from '../widget/Modal';
import { openModal,  showBarChart, showMonthOverview, showWeekdayOverview, showWeekOverview } from '../../reducers/barChart';
import ReactTooltip from 'react-tooltip';
import Footer from './Footer';
import {getAverageColor} from "../../helpers/colors";
import clock from './clock.svg';

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
    const xScale = d3.scaleTime();
    const xScaleArea = d3.scaleLinear().nice();
    const yScale = d3.scaleLinear().nice();

    const currentWeekInsights = this.props.isWeekOverviewChecked && getCurrentWeekInsights(this.props.dataArr, this.props.selectedDay, this.props.dayInsights);

    const checkedBox = this.props.isWeekOverviewChecked || this.props.isMonthOverviewChecked || this.props.isWeekdayOverviewChecked;

    const max = currentWeekInsights ?
      Math.ceil(Math.max(d3.max(Object.values(currentWeekInsights)), d3.max(Object.values(data)))) :
      d3.max(Object.values(data));

    const yDomain = [0, checkedBox ? max + max / 20 : max];

    const parseTime = d3.timeParse('%H:%M');
    const midnight = parseTime('00:00');

    xScale
      .domain([midnight, d3.timeDay.offset(midnight, 1)])
      .range([0, this.state.width - props.margin.right]);

    xScaleArea
      .domain([0, 23])
      .range([0, this.state.width - props.margin.right - 10]);

    yScale
      .domain(yDomain)
      .range([props.height - props.margin.top - props.margin.bottom, 0]);

    return {xScale, yScale, xScaleArea};
  };

  updatePlotSize = props => {
    const plotWidth = this.state.width - (props.margin.left + props.margin.right);
    const plotHeight = props.height;
    return {plotWidth, plotHeight}
  };

  hideModal = () => {
    this.props.openModal(null);
  };

  convertRange = (val, r1, r2 )=> (val - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];

  renderModal = props =>
    <Modal show={props.modalData} handleClose={this.hideModal}>
      <div className='modal-title'>{moment(props.selectedDay,'YYYY-MM-DD').format('dddd, MMMM DD YYYY')}</div>
      {props.modalData && <div>between {moment(props.modalData.data, 'hh').format('H:mm')} - {moment(parseInt(props.modalData.data)+1, 'hh').format('H:mm')}</div>}
      <div className='clock-icon'>
        <img src={clock} alt='' width={50} height={50} />
      </div>
      <div className='time-container'>
        {
          Object.keys(props.timeArray).map(key =>
            <span className='time' style={{ fontSize: this.convertRange(props.timeArray[key], [1,20], [15,50]) }}>
              {key}
            </span>
          )
        }
      </div>
    </Modal>;

  render() {
    let data = [];
    if (!!this.props.monthInsights.length) {
      data = this.props.daysOfMonth;
    } else if (!!this.props.weekdayInsights.length) {
      data = this.props.daysOfWeekday;
    } else {
      data = this.props.data;
    }
    const { xScale, yScale, xScaleArea } =  this.updateScale(this.props, data);
    const { plotWidth, plotHeight } = this.updatePlotSize(this.props);

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

    const color = this.props.color || getAverageColor(this.props.selectedMonth, this.props.selectedWeekday, this.props.colors);

    return (
      <div>
        <svg width='100%' height={this.props.height} ref='barChart'>
          <g transform={transform} width={plotWidth} height={plotHeight}>
            <XAxis {...metaData} transform={`translate(0,${plotHeight-50})`}/>
            <YAxis {...metaData} />
            <Bars {...metaData} {...plotData} color={color} />
            { showAreaChart && <AreaChart {...metaData} {...plotData} margin={this.props.margin} weekInsights={insights} color={color} />}
          </g>
        </svg>
        <Footer />
        <ReactTooltip id='rectTooltip' multiline class='tooltip'/>
        { this.renderModal(this.props) }
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
  selectedDay: moment(state.calendar.selectedDay).format('YYYY-MM-DD'),
  selectedMonth: state.app.selectedMonth,
  selectedWeekday: state.app.selectedWeekday,
  dataArr: state.app.data,
  allDays: state.app.allDays,
  currentWeekdays: state.calendar.currentWeekdays,
  isWeekOverviewChecked: state.barChart.showWeekOverview,
  isMonthOverviewChecked: state.barChart.showMonthOverview,
  isWeekdayOverviewChecked: state.barChart.showWeekdayOverview,
  color: state.calendar.color,
  colors: state.calendar.colors,
  modalData: state.barChart.modalData,
  timeArray: state.barChart.timeArray
});

const mapDispatchToProps = dispatch => ({
  showWeekOverview: val => dispatch(showWeekOverview(val)),
  showMonthOverview: val => dispatch(showMonthOverview(val)),
  showWeekdayOverview: val => dispatch(showWeekdayOverview(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  openModal: val => dispatch(openModal(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(BarChart);
