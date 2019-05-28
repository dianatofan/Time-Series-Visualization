import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import Dropdown from 'react-dropdown';
import classNames from 'classnames';
import * as d3 from 'd3';

import { setData, setDatasetName, showSpinner, setMonthInsights, setWeekInsights, setWeekdayInsights, uploadFile } from '../../reducers/app';
import { showCalendar, selectDay, resetColors } from '../../reducers/calendar';
import { showBarChart, showWeekOverview, showMonthOverview, showWeekdayOverview } from '../../reducers/barChart';

import Section from './Section';

import dataset1 from '../../data/itching_in_nose_tbc.csv';
import dataset2 from '../../data/itch_tbc.csv';
import dataset3 from '../../data/ptsd_filtered.csv';
import dataset4 from '../../data/data.csv';

const Upload = props => {
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
    props.showCalendar(false);
    props.setMonthInsights({
      monthInsights: [],
      daysOfMonth: []
    });
    props.setWeekdayInsights({
      selectedWeekday: null,
      daysOfWeekday: [],
      weekdayInsights: []
    });
    props.setWeekInsights({
      selectedWeek: null,
      daysOfWeek: [],
      weekInsights: []
    });
    props.selectDay(null);
    props.showWeekOverview(false);
    props.showMonthOverview(false);
    props.showWeekdayOverview(false);
    props.resetColors();
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


  return (
    <Section title='Select dataset' className='upload-section'>
      <div className='upload-dataset'>
        <Dropdown
          className='dropdown'
          options={options}
          placeholder='Choose...'
          value={props.datasetName}
          onChange={onSelect}
        />
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
                          <i className='fa fa-remove' />
                      {files}
                        </span>
                    : <span className='upload-message'>
                          <i className='fa fa-upload' />
                            Drag & Drop
                        </span>
                }
              </div>
            )
          }}
        </Dropzone>
      </div>
    </Section>
  )
};

const mapStateToProps = state => ({
  files: state.app.files,
  datasetName: state.app.datasetName
});

const mapDispatchToProps = dispatch => ({
  uploadFile: val => dispatch(uploadFile(val)),
  setData: val => dispatch(setData(val)),
  setDatasetName: val => dispatch(setDatasetName(val)),
  showSpinner: val => dispatch(showSpinner(val)),
  showCalendar: val => dispatch(showCalendar(val)),
  showBarChart: val => dispatch(showBarChart(val)),
  setMonthInsights: val => dispatch(setMonthInsights(val)),
  setWeekInsights: val => dispatch(setWeekInsights(val)),
  setWeekdayInsights: val => dispatch(setWeekdayInsights(val)),
  selectDay: val => dispatch(selectDay(val)),
  showWeekOverview: val => dispatch(showWeekOverview(val)),
  showMonthOverview: val => dispatch(showMonthOverview(val)),
  showWeekdayOverview: val => dispatch(showWeekdayOverview(val)),
  resetColors: val => dispatch(resetColors(val))
});


export default connect(mapStateToProps, mapDispatchToProps)(Upload);
