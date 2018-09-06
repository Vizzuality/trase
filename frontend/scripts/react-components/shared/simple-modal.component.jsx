import React from 'react';
import ReactModal from 'react-modal';

function SimpleModal(props) {
  return (
    <ReactModal {...props} className="c-simple-modal" overlayClassName="c-simple-modal-overlay" />
  );
}

export default SimpleModal;
