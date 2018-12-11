import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'redux-first-router-link';

function LinkButton({ children, className, ...props }) {
  return (
    <Link className={cx('c-button -with-icon', className)} {...props}>
      {children}
      <svg className="icon icon-link" style={{ pointerEvents: 'none' }}>
        <use xlinkHref="#icon-link" />
      </svg>
    </Link>
  );
}

LinkButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any
};

export default LinkButton;
