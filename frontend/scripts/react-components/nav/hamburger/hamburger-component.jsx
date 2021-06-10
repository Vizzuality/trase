import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './hamburger.scss';

const Hamburger = ({ className, isOpen, onClick }) => (
  <button
    aria-expanded={isOpen}
    aria-label={isOpen ? 'Close the menu' : 'Open the menu'}
    aria-controls="menu-list"
    className={cx('c-hamburger', className)}
    onClick={onClick}
  >
    <div className="hamburgerContent">
      <span
        aria-hidden="true"
        className={cx('bar', {
          openedTop: isOpen,
          closedTop: !isOpen
        })}
      />
      <span aria-hidden="true" className={cx('bar', { openedMiddle: isOpen })} />
      <span
        aria-hidden="true"
        className={cx('bar', {
          openedBottom: isOpen,
          closedBottom: !isOpen
        })}
      />
    </div>
  </button>
);

Hamburger.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default Hamburger;
