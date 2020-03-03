import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Button from 'react-components/shared/button/button.component';

function LinkButton({ children, onClick, ...props }) {
  return (
    <button
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Button as={Link} icon="icon-link" {...props}>
        {children}
      </Button>
    </button>
  );
}

LinkButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.any
};

export default LinkButton;
