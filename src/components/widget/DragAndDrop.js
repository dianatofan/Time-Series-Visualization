import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import * as d3 from 'd3';

import Section from '../widget/Section';

import { setData, uploadFile } from '../../reducers/app';
import { showCalendar } from '../../reducers/calendar';

const DragAndDrop = props => {
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

  return (
    <Section title='Upload file'>
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
                              Drag & Drop your file or <u>Browse</u>
                          </span>
              }
            </div>
          )
        }}
      </Dropzone>
    </Section>
  )
};

const mapStateToProps = state => ({
  files: state.app.files
});

const mapDispatchToProps = dispatch => ({
  uploadFile: val => dispatch(uploadFile(val)),
  setData: val => dispatch(setData(val)),
  showCalendar: val => dispatch(showCalendar(val))
});


export default connect(mapStateToProps, mapDispatchToProps)(DragAndDrop);
