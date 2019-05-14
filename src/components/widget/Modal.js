import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Modal.scss';

import { openModal } from "../../reducers/barChart";

const Modal = ({ handleClose, show, children, modalData, openModal }) => {
  const hideModal = () => {
    openModal(null);
  };

  return (
    <div className={classNames('modal', 'modal-animation', {'display-block': show}, {'display-none': !show})} onClick={hideModal}>
      <section className='modal-main' onClick={ev => ev.stopPropagation()}>
        <i className='fas fa-times' onClick={handleClose} />
        {children}
      </section>
    </div>
  )
};

const mapStateToProps = state => ({
  modalData: state.barChart.modalData
});

const mapDispatchToProps = dispatch => ({
  openModal: val => dispatch(openModal(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
