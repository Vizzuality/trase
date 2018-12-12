import React from 'react';
import PropTypes from 'prop-types';

import './error-message.scss';

function ErrorMessage(props) {
  return (
    <div className="c-error-message -absolute -charcoal">
      <p className="message">Oops! Something went wrong.</p>
      <p className="message">{props.errorMessage}</p>
    </div>
  );
}

ErrorMessage.propTypes = { errorMessage: PropTypes.string };

export default ErrorMessage;
