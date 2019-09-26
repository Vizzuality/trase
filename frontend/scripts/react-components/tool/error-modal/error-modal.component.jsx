import React from 'react';
import PropTypes from 'prop-types';

const ErrorModal = ({ resetSankey, noLinksFound }) =>
  noLinksFound && (
    <div className="c-sankey-error-modal">
      <div className="veil -with-menu -below-nav" />
      <div className="c-modal -below-nav">
        <div className="content -auto-height">
          The current selection produced no results. This may be due to data not being available for
          the current configuration or due to an error in loading the data. Please change your
          selection or reset the tool to its default settings.
          <button className="c-button" onClick={resetSankey}>
            reset
          </button>
        </div>
      </div>
    </div>
  );

ErrorModal.propTypes = {
  resetSankey: PropTypes.func.isRequired,
  noLinksFound: PropTypes.bool
};

export default ErrorModal;
