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
import {selectDay} from "../../reducers/barChart";

class BarChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      circleHoverIndex: -1,
      isChecked: false,
      width: document.getElementById('card').clientWidth - props.margin.left - props.margin.right
    };
    window.addEventListener('resize', this.resize().bind(this));
  }

  resize() {
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
  }

  updateScale = props => {
    const showBarChart = !!this.props.dayInsights[this.props.selectedDay];

    const data = props.data;

    const xScale = d3.scaleBand();
    const yScale = d3.scaleLinear().nice();

    const xDomain = [...Array(24).keys()];
    const yDomain = [0, d3.max(Object.values(data))];

    xScale
      .domain(xDomain)
      .range([0, this.state.width - props.margin.right])
      .paddingInner(props.paddingInner)
      .paddingOuter(props.paddingOuter);

    yScale
      .domain(yDomain)
      .range([props.height - props.margin.top - props.margin.bottom, 0]);

    return {xScale, yScale};
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
    const showBarChart = !!this.props.dayInsights[this.props.selectedDay];

    const renderBarChart = () => {
      const { xScale, yScale } =  this.updateScale(this.props);
      const { plotWidth, plotHeight } = this.updatePlotSize(this.props);

      const max = d3.max(Object.values(this.props.data));
      const nrOfTicks = max < 10 ? max : max / 2;

      const metaData = {
        xScale,
        yScale,
        plotWidth,
        plotHeight,
        nrOfTicks
      };
      const plotData = {
        plotData: Object.keys(this.props.data).map((item, i) => ({
          id: i,
          data: item,
          x: xScale(item),
          y: yScale(this.props.data[item]),
          width: xScale.bandwidth(),
          height: plotHeight - yScale(this.props.data[item]) - this.props.margin.top - this.props.margin.bottom,
          occurrences: this.props.data[item]
        }))
      };
      const transform = `translate(${this.props.margin.left},${this.props.margin.top})`;

      return (
        <svg width='100%' height={this.props.height} ref='barChart'>
          <g transform={transform} width={plotWidth} height={plotHeight}>
            <XAxis {...metaData} transform={`translate(0,${plotHeight})`}/>
            <YAxis {...metaData} />
            <Bars {...metaData} {...plotData} />
            {
              this.state.isChecked &&
              <AreaChart
                xScale={xScale}
                yScale={yScale}
                plotHeight={plotHeight}
                margin={this.props.margin}
                selectedDay={this.props.selectedDay}
                occurrences={this.props.data}
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
          isChecked: !this.state.isChecked
        })
      };
      return (
        <div className='footer yearLabel'>
         <span className={classNames('checkbox', {'bold': this.state.isChecked})} onClick={onCheckboxChange}>
           Show week overview <input type='checkbox' checked={this.state.isChecked} defaultChecked={false} onChange={onCheckboxChange} />
         </span>
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
  selectedDay: moment(state.barChart.selectedDay).format('YYYY-MM-DD')
});

const mapDispatchToProps = dispatch => ({
  selectDay: val => dispatch(selectDay(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(BarChart);
