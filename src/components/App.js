import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';
import data from '../data/data.csv';
import parseData from '../helpers/parser';
import classNames from 'classnames';
import Heatmap from './Heatmap';
import 'filepond/dist/filepond.min.css';
import Dropzone from 'react-dropzone'

class App extends Component {
  constructor () {
    super();
    this.state = {
      data: [],
      files: []
    };
  }

  handleInit() {
    console.log('FilePond instance has initialised', this.pond);
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
        // do whatever you want with the file content
        this.setState({ data: parseData(parsed), rawData: parsed });
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  };

  render () {
    const files = this.state.files.map(file => (
      <span>
         <b key={file.name}>
           {file.name}
         </b>
         <span>
           {file.size} bytes
         </span>
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
                    className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
                  >
                    <input {...getInputProps()} />
                    {
                      !!files.length
                        ? <span>
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
