import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import cx from 'classnames';

import './simple-modal.scss';

function SimpleModal(props) {
  return (
    <ReactModal
      {...props}
      className={cx('c-simple-modal', props.className)}
      overlayClassName="c-simple-modal-overlay"
      ariaHideApp={false}
    >
      <div className="simple-modal-content">
        <div className="simple-modal-close">
          <button onClick={props.onRequestClose || props.onClickClose}>
            <span>close</span>
            <svg className="icon icon-close">
              <use xlinkHref="#icon-close" />
            </svg>
          </button>
        </div>
        {props.children}
      </div>
    </ReactModal>
  );
}

SimpleModal.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onClickClose: PropTypes.func,
  onRequestClose: PropTypes.func
};

export default SimpleModal;
