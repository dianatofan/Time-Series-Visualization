import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Heatmap from './calendar/Heatmap';
import Container from './bar-chart/Container';
import RadialChartContainer from './radial-chart/RadialChartContainer';
import Upload from './widget/Upload';

import 'react-dropdown/style.css';
import './App.scss';
import './Spinner.scss';

import githubLogo from '../icons/github-logo.svg';
import githubLogoHover from '../icons/github-logo-hover.svg';
import pdfLogo from '../icons/pdf-logo.svg';
import pdfLogoHover from '../icons/pdf-logo-hover.svg';
import {resetShiftSelection} from "../reducers/app";

// import { whyDidYouUpdate } from 'why-did-you-update';

const App = props => {
  // whyDidYouUpdate(React);

  const renderBarChart = () =>
    <Container
      plotData={props.allDays[props.selectedDay]}
      margin={{ top: 10, right: 30, bottom: 40, left: 50 }}
      height={300}
    />;

  const renderSpinner = () =>
    <div className='spinner'>
      <div className='double-bounce1' />
      <div className='double-bounce2' />
    </div>;

  return (
    <div className='app' onClick={props.resetShiftSelection}>
      <header className='header'>
        <div className='title'> Visualizing Time-Series Data </div>
        <div className='icons'>
          <a href='https://github.com/diana-tofan/Time-Series-Visualization' target='_blank' rel='noopener noreferrer'>
            <img className='github-icon' src={githubLogo} alt='Github' onMouseOver={ev => ev.currentTarget.src = githubLogoHover} onMouseLeave={ev => ev.currentTarget.src = githubLogo} />
          </a>
          <a href='https://www.overleaf.com/read/vptjwvyzjnvg' target='_blank' rel='noopener noreferrer'>
            <img className='pdf-icon' src={pdfLogo} alt='Report' onMouseOver={ev => ev.currentTarget.src = pdfLogoHover} onMouseLeave={ev => ev.currentTarget.src = pdfLogo} />
          </a>
        </div>
      </header>
      <div className='content'>
        <Upload />
        { props.isCalendarVisible && <Heatmap /> }
        { props.isBarChartVisible &&
          <div>
            <p>Day overview</p>
            <div className='charts-container'>
              { renderBarChart() }
              { props.isBarChartVisible && <RadialChartContainer /> }
            </div>
          </div>
        }
        { props.isSpinnerVisible && renderSpinner() }
      </div>
    </div>
  )
};

const mapStateToProps = state => ({
  allDays: state.app.allDays,
  selectedDay: moment(state.calendar.selectedDay).format('YYYY-MM-DD'),
  isCalendarVisible: state.calendar.isCalendarVisible,
  isBarChartVisible: state.barChart.isBarChartVisible,
  isSpinnerVisible: state.app.isSpinnerVisible
});

const mapDispatchToProps = dispatch => ({
  resetShiftSelection: val => dispatch(resetShiftSelection(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
