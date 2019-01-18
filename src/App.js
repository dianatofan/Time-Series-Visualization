import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from 'd3';
import { withFauxDOM } from 'react-faux-dom';
import data from './data.csv';
import parseData from './parser';

import Calendar from './Calendar';

class App extends Component {
  constructor () {
    super();
    this.state = {
      data: [],
      dataArray0: [30, 35, 45, 55, 70],
      dataArray1: [50, 55, 45, 35, 20, 25, 25, 40],
      dataIndex: 0
    };
    this.changeData = this.changeData.bind(this);
  }

  componentDidMount () {
    d3.csv(data).then(function(data) {
      console.log(parseData(data));
      // this.setState({ data: parseData(data) });
    }).catch(function(err) {
      throw err;
    });
  }

  changeData () {
    this.setState(state => ({
      dataIndex: (state.dataIndex + 1) % 2
    }))
  }

  render () {
    return (
      <div className='app'>
        <div className='column' id='left'>
          <div className='topLeft'>
            <i className="fas fa-clock" />
          </div>
          <div className='bottom'>
          </div>
        </div>
        <div className='column' id='right'>
          <div className='up' />
          {/*<div className='topRight'>*/}
          {/*</div>*/}
          {/*<div className='bottom'>*/}
          {/*</div>*/}
          <div>
            <button onClick={this.changeData}>Change data</button>
            <Calendar
              data={this.state['dataArray' + this.state.dataIndex]}
              title={'dataset ' + this.state.dataIndex}
            />
          </div>
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  chart: 'loading'
};

export default withFauxDOM(App);
