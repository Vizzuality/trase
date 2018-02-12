import PropTypes from 'prop-types';
import React from 'react';

function TeamPageMessage(props) {
  const { message } = props;
  return (
    <section className="not-found">
      <div className="row column">
        <p className="not-found-text">{message}</p>
      </div>
    </section>
  );
}

TeamPageMessage.propTypes = {
  message: PropTypes.string
};

export default TeamPageMessage;
