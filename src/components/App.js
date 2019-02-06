import React from 'react';
import { connect } from 'react-redux';
import { setData, uploadFile } from '../reducers/app';
import { showCalendar } from '../reducers/calendar';
import './App.css';
import * as d3 from 'd3';
import classNames from 'classnames';
import Heatmap from './calendar/Heatmap';
import RadialChart from './radial-chart/RadialChart';
import Dropzone from 'react-dropzone'

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

  const files = props.files.map(file => (
    <span>
         <b key={file.name}>
           {file.name}
         </b>
         <div className='file-size'>
           {bytesToSize(file.size)}
         </div>
      </span>
  ));

  return (
    <div className='app'>
      <header className='header'>
        <div className='title'> Visualizing Time-Series Data </div>
      </header>
      <div className='content'>
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
        {
          props.isCalendarVisible &&
          <section>
            <p>Calendar heatmap</p>
            <Heatmap
              data={props.data}
              rawData={props.rawData}
            />
          </section>
        }
        {
          props.isRadialChartVisible &&
          <section>
            <p>Day overview</p>
            <RadialChart
              key={props.data}
            />
          </section>
        }
      </div>
    </div>
  )
};

const mapStateToProps = state => ({
  data: state.app.data,
  rawData: state.app.rawData,
  files: state.app.files,
  isCalendarVisible: state.calendar.isCalendarVisible,
  isRadialChartVisible: state.radialChart.isRadialChartVisible
});

const mapDispatchToProps = dispatch => ({
  uploadFile: val => dispatch(uploadFile(val)),
  showCalendar: val => dispatch(showCalendar(val)),
  setData: val => dispatch(setData(val))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
