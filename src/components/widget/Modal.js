import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Modal.scss';

import { openModal } from "../../reducers/barChart";
import moment from 'moment';
import clock from "../../icons/clock.svg";

class Modal extends React.PureComponent {

  hideModal = () => {
    this.props.openModal(null);
  };

  convertRange = (val, r1, r2 )=> (val - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];

  render() {
    const { selectedDay, modalData, timeArray } = this.props;
      return (
      <div className={classNames('modal', 'modal-animation', {'display-block': modalData}, {'display-none': !modalData})} onClick={this.hideModal}>
        <section className='modal-main' onClick={ev => ev.stopPropagation()}>
          <i className='fas fa-times' onClick={this.hideModal} />
          <div className='modal-title'>{selectedDay}</div>
          {modalData && <div>between {moment(modalData.data, 'hh').format('H:mm')} - {moment(parseInt(modalData.data)+1, 'hh').format('H:mm')}</div>}
          <div className='clock-icon'>
            <img src={clock} alt='' width={50} height={50} />
          </div>
          <div className='time-container'>
            {
              Object.keys(timeArray).map(key =>
                  <span className='time' style={{ fontSize: this.convertRange(timeArray[key], [1,20], [15,50]) }}>
              {key}
            </span>
              )
            }
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  modalData: state.barChart.modalData,
  selectedDay: moment(state.calendar.selectedDay).format('dddd, MMMM DD YYYY'),
  timeArray: state.barChart.timeArray
});

const mapDispatchToProps = dispatch => ({
  openModal: val => dispatch(openModal(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
