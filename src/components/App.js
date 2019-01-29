import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';
import data from '../data/data.csv';
import parseData from '../helpers/parser';
import Heatmap from './Heatmap';

class App extends Component {
  constructor () {
    super();
    this.state = {
      data: []
    };
  }

  componentDidMount () {
    d3.csv(data).then(data => {
      this.setState({ data: parseData(data), rawData: data });
    }).catch(err => {
      throw err;
    });
  }

  render () {
    return (
      <div className='app'>
        <header className='header'>
          <div className='title'> Visualizing Time-Series Data </div>
        </header>
        <div className='content'>
          <section>
            <p>Calendar heatmap</p>
            {
              Object.keys(this.state.data).length > 0 &&
              <Heatmap
                data={this.state.data}
                rawData={this.state.rawData}
              />
            }
          </section>
      </div>
      </div>
    );
  }
}

export default App;
