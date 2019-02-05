import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';
import data from '../data/data.csv';
import parseData from '../helpers/parser';
import classNames from 'classnames';
import Heatmap from './calendar/Heatmap';
import Dropzone from 'react-dropzone'

class App extends Component {
  constructor () {
    super();
    this.state = {
      data: [],
      files: []
    };
  }

  // componentDidMount () {
  //   d3.csv(data).then(data => {
  //     this.setState({ data: parseData(data), rawData: data });
  //   }).catch(err => {
  //     throw err;
  //   });
  // }

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.setState({ files: acceptedFiles });
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        const parsed = d3.csvParse(data);
        this.setState({ data: parseData(parsed), rawData: parsed });
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  };

  render () {
    const bytesToSize = bytes => {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Byte';
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    const files = this.state.files.map(file => (
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
            <Dropzone onDrop={this.onDrop}>
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
                        : <span>
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
            !!Object.keys(this.state.data).length &&
            <section>
              <p>Calendar heatmap</p>
              <Heatmap
                data={this.state.data}
                rawData={this.state.rawData}
              />
            </section>
          }
      </div>
      </div>
    );
  }
}

export default App;
