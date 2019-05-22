import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import Heatmap from './calendar/Heatmap';
import Container from './bar-chart/Container';
import Upload from './widget/Upload';

import 'react-dropdown/style.css';
import './App.scss';
import './Spinner.scss';

import githubLogo from '../icons/github-logo.svg';
import githubLogoHover from '../icons/github-logo-hover.svg';
import pdfLogo from '../icons/pdf-logo.svg';
import pdfLogoHover from '../icons/pdf-logo-hover.svg';

// import { whyDidYouUpdate } from 'why-did-you-update';

const App = props => {
  // whyDidYouUpdate(React);

  const renderBarChart = showDatasetOverview =>
    <Container
      data={props.allDays[props.selectedDay]}
      margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
      height={300}
      showDatasetOverview={showDatasetOverview}
    />;

  const renderSpinner = () =>
    <div className='spinner'>
      <div className='double-bounce1' />
      <div className='double-bounce2' />
    </div>;

  return (
    <div className='app'>
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
              { renderBarChart(true) }
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

export default connect(mapStateToProps)(App);
