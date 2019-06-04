import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Modal.scss';

import { openModal } from "../../reducers/barChart";
import moment from 'moment';
import clock from "../../icons/clock.svg";

class Modal extends React.PureComponent {

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp, false);
  }

  handleKeyUp = ev => {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.hideModal();
    }
  };

  hideModal = () => {
    this.props.openModal(null);
  };

  convertRange = (val, r1, r2 )=> (val - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];

  getString = selectedItem => {
    if (this.props.selectedMonth) {
      return moment(this.props.selectedMonth, 'M').format('MMMM');
    } else if (this.props.selectedWeek) {
      return `Week ${this.props.selectedWeek}`;
    } else if (this.props.selectedWeekday) {
      return `${moment(this.props.selectedWeekday, 'ddd').format('dddd')}s`;
    } else {
      return moment(selectedItem).format('dddd, MMMM DD YYYY');
    }
  };

  render() {
    const { selectedDay, selectedMonth, selectedWeekday, selectedWeek, modalData, timeArray } = this.props;
    const selectedItem = selectedMonth || selectedWeekday || selectedDay || selectedWeek;
      return (
      <div className={classNames('modal', 'fade-in', {'display-block': modalData}, {'display-none': !modalData})} onClick={this.hideModal}>
        <section className='modal-main' onClick={ev => ev.stopPropagation()}>
          <i className='fas fa-times' onClick={this.hideModal} />
          <div className='modal-title'>{ this.getString(selectedItem) }</div>
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
  timeArray: state.barChart.timeArray,
  selectedDay: state.calendar.selectedDay,
  selectedWeek: state.app.selectedWeek,
  selectedMonth: state.app.selectedMonth,
  selectedWeekday: state.app.selectedWeekday,
});

const mapDispatchToProps = dispatch => ({
  openModal: val => dispatch(openModal(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
