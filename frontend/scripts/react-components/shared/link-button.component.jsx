import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import Button from 'react-components/shared/button/button.component';

function LinkButton({ children, ...props }) {
  return (
    <Button as={Link} icon="icon-link" {...props}>
      {children}
    </Button>
  );
}

LinkButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any
};

export default LinkButton;
