import React from 'react';
import PropTypes from 'prop-types';

function DashboardModalFooter(props) {
  const { dynamicSentenceParts, clearItem, onContinue } = props;

  return (
    <div className="c-dashboard-modal-footer">
      <p className="dashboard-modal-footer-text">
        {dynamicSentenceParts.map(part => (
          <React.Fragment>
            {`${part.prefix} `}
            {part.value && (
              <span className="modal-footer-item notranslate">
                {part.value}
                <button
                  onClick={() => clearItem(part.panel)}
                  className="modal-footer-item-remove-arrow"
                  type="button"
                >
                  <svg className="icon icon-close">
                    <use xlinkHref="#icon-close" />
                  </svg>
                </button>
              </span>
            )}
          </React.Fragment>
        ))}
      </p>
      <button type="button" onClick={onContinue} className="c-button -pink -large">
        Continue
      </button>
    </div>
  );
}

DashboardModalFooter.propTypes = {
  dynamicSentenceParts: PropTypes.array,
  clearItem: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired
};

export default DashboardModalFooter;
