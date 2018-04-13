import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';

function LinkButton({ children, ...props }) {
  return (
    <Link className="c-button -with-icon -medium-large" {...props}>
      {children}
      <svg className="icon icon-link">
        <use xlinkHref="#icon-link" />
      </svg>
    </Link>
  );
}

LinkButton.propTypes = {
  children: PropTypes.any
};

export default LinkButton;
