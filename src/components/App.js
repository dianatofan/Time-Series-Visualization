import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import Dropdown from 'react-dropdown';
import * as d3 from 'd3';

import { setData, uploadFile, setDatasetName, showSpinner, showEmptyContainer } from '../reducers/app';
import { showCalendar } from '../reducers/calendar';
import { showBarChart } from '../reducers/barChart';

import Heatmap from './calendar/Heatmap';
import BarChart from './bar-chart/BarChart';

import 'react-dropdown/style.css';
import './App.scss';
import './Spinner.scss';

import dataset1 from '../data/itching_in_nose_tbc.csv';
import dataset2 from '../data/itch_tbc.csv';
import dataset3 from '../data/ptsd.csv';
import dataset4 from '../data/data.csv';

const App = props => {
  const onDrop = (acceptedFiles, rejectedFiles) => {
    props.uploadFile(acceptedFiles);
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        const parsed = d3.csvParse(data);
        props.setData(parsed);
        props.showCalendar(true);
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.readAsBinaryString(file);
    });
  };

  const bytesToSize = bytes => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  const files = props.files.map((file, i) => (
    <span key={i}>
         <b key={file.name}>
           {file.name}
         </b>
         <div className='file-size'>
           {bytesToSize(file.size)}
         </div>
      </span>
  ));
  const options = ['Dataset_1.csv', 'Dataset_2.csv', 'Dataset_3.csv', 'Dataset_4.csv'];
  const renderHeatmap = dataset => {
    d3.csv(dataset).then(data => {
      props.setData(data);
      props.showCalendar(true);
    }).catch(err => {
      throw err;
    });
  };
  const removeCharts = () => {
    props.showBarChart(false);
    props.showEmptyContainer(false);
    props.showCalendar(false);
  };
  const onSelect = item => {
    removeCharts();
    const value = item.value;
    props.setDatasetName(value);
    props.showSpinner(true);
    if (value === 'Dataset_1.csv') {
      renderHeatmap(dataset1);
    }
    if (value === 'Dataset_2.csv') {
      renderHeatmap(dataset2);
    }
    if (value === 'Dataset_3.csv') {
      renderHeatmap(dataset3);
    }
    if (value === 'Dataset_4.csv') {
      renderHeatmap(dataset4);
    }
  };

  const showDropzone = false;

  return (
    <div className='app'>
      <header className='header'>
        <div className='title'> Visualizing Time-Series Data </div>
      </header>
      <div className='content'>
        {
          showDropzone &&
          <section>
          <p>Upload file</p>
          <Dropzone
            accept='text/csv'
            onDrop={onDrop}
          >
            {({getRootProps, getInputProps, isDragActive}) => {
              return (
                <div
                  {...getRootProps()}
                  className={classNames('dropzone', {'dropzone--isActive': isDragActive, 'dropzone--isDone': !!files.length})}
                >
                  <input {...getInputProps()} />
                  {
                    !!files.length
                      ? <span className='file-name'>
                          <i className="fa fa-remove" />
                        {files}
                        </span>
                      : <span className='upload-message'>
                          <i className="fa fa-upload" />
                            Drag & Drop your file or <u>Browse</u>
                        </span>
                  }
                </div>
              )
            }}
          </Dropzone>
        </section>
        }
        <section>
          <p>Select dataset</p>
          <Dropdown
            className='dropdown'
            options={options}
            placeholder='Choose...'
            value={props.datasetName}
            onChange={onSelect}
          />
        </section>
        {
          props.isCalendarVisible &&
          <section>
            <p>Calendar heatmap</p>
            <Heatmap
              data={props.data}
              dayInsights={props.dayInsights}
            />
          </section>
        }
        {
          props.isBarChartVisible &&
          <section>
            <p>Day overview</p>
            <BarChart
              key={props.data}
            />
          </section>
        }
        {
          props.isEmptyContainerVisible &&
          <section>
            <p>Day overview</p>
            <div className='container'>
              <div className='dayLabel'>
                { moment(props.selectedDay).format('dddd, MMMM DD YYYY') }
              </div>
              <div className='emptyString'>No data recorded</div>
            </div>
          </section>
        }
        {
          props.isSpinnerVisible &&
          <div className='spinner'>
            <div className="double-bounce1" />
            <div className="double-bounce2" />
          </div>
        }
      </div>
    </div>
  )
};

const mapStateToProps = state => ({
  data: state.app.data,
  datasetName: state.app.datasetName,
  dayInsights: state.app.dayInsights,
  selectedDay: moment(state.barChart.selectedDay).format('YYYY-MM-DD'),
  files: state.app.files,
  isCalendarVisible: state.calendar.isCalendarVisible,
  isBarChartVisible: state.barChart.isBarChartVisible,
  isEmptyContainerVisible: state.app.isEmptyContainerVisible,
  isSpinnerVisible: state.app.isSpinnerVisible
});

const mapDispatchToProps = dispatch => ({
  uploadFile: val => dispatch(uploadFile(val)),
  showCalendar: val => dispatch(showCalendar(val)),
  setData: val => dispatch(setData(val)),
  setDatasetName: val => dispatch(setDatasetName(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  showEmptyContainer: val => dispatch(showEmptyContainer(val)),
  showSpinner: val => dispatch(showSpinner(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
