import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import cx from 'classnames';

import './simple-modal.scss';

function SimpleModal(props) {
  const {
    noClose,
    closeLabel,
    onRequestClose,
    onClickClose,
    overlayClassName,
    className,
    children
  } = props;
  return (
    <ReactModal
      {...props}
      className={cx('c-simple-modal', className)}
      overlayClassName={cx('c-simple-modal-overlay', overlayClassName)}
      ariaHideApp={false}
    >
      <div className="simple-modal-content">
        <div className="simple-modal-close">
          {!noClose && (
            <button onClick={onRequestClose || onClickClose}>
              <span>{closeLabel}</span>
              <svg className="icon icon-close">
                <use xlinkHref="#icon-close" />
              </svg>
            </button>
          )}
        </div>
        {children}
      </div>
    </ReactModal>
  );
}

SimpleModal.propTypes = {
  children: PropTypes.any,
  closeLabel: PropTypes.string,
  contentClassName: PropTypes.string,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  onClickClose: PropTypes.func,
  onRequestClose: PropTypes.func,
  noClose: PropTypes.bool
};

SimpleModal.defaultProps = {
  closeLabel: 'close',
  noClose: false
};

export default SimpleModal;
