import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'redux-first-router-link';
import Button from 'react-components/shared/button.component';

function LinkButton({ children, className, ...props }) {
  return (
    <Button as={Link} className={cx('-with-icon', className)} {...props}>
      {children}
      <svg className="icon icon-link" style={{ pointerEvents: 'none' }}>
        <use xlinkHref="#icon-link" />
      </svg>
    </Button>
  );
}

LinkButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any
};

export default LinkButton;
