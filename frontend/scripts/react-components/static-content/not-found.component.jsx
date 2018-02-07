import React from 'react';
import PropTypes from 'prop-types';

const NotFound = ({ emoji, text }) => (
  <section className="not-found">
    <div className="row column">
      <p className="not-found-text">
        {text}
        {emoji && (
          <span className="emoji" role="img" aria-label="page not found">
            {' '}
            {emoji}
          </span>
        )}
      </p>
    </div>
  </section>
);

NotFound.propTypes = {
  text: PropTypes.string,
  emoji: PropTypes.string
};

NotFound.defaultProps = {
  text: "Oops! We can't seem to find the page you are looking for."
};

export default NotFound;
