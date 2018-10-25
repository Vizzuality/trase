import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function DashboardModalFooter(props) {
  const {
    editMode,
    isPanelFooter,
    dynamicSentenceParts,
    clearItem,
    onContinue,
    onBack,
    isDisabled
  } = props;

  return (
    <div className="c-dashboard-modal-footer">
      {!editMode && (
        <p className="dashboard-modal-footer-text">
          {dynamicSentenceParts.map((part, i) => (
            <React.Fragment key={part.prefix + part.value + i}>
              {`${part.prefix} `}
              {part.value && (
                <span
                  className={cx('modal-footer-item', 'notranslate', { '-with-cross': clearItem })}
                >
                  {part.value}
                  {clearItem && (
                    <button
                      onClick={() => clearItem(part.panel)}
                      className="modal-footer-item-remove-cross"
                      type="button"
                    >
                      <svg className="icon icon-close">
                        <use xlinkHref="#icon-close" />
                      </svg>
                    </button>
                  )}
                </span>
              )}
            </React.Fragment>
          ))}
        </p>
      )}
      <div className="dashboard-modal-actions">
        {onBack &&
          !editMode && (
            <button type="button" onClick={onBack} className="dashboard-modal-back-button">
              Back To Options
            </button>
          )}
        <button
          type="button"
          onClick={onContinue}
          className="c-button -pink -large"
          disabled={isDisabled}
        >
          {isPanelFooter && !editMode ? 'Continue' : 'Go to dashboard'}
        </button>
      </div>
    </div>
  );
}

DashboardModalFooter.propTypes = {
  onBack: PropTypes.func,
  clearItem: PropTypes.func,
  isDisabled: PropTypes.bool,
  isPanelFooter: PropTypes.bool,
  editMode: PropTypes.bool,
  dynamicSentenceParts: PropTypes.array,
  onContinue: PropTypes.func.isRequired
};

DashboardModalFooter.defaultProps = {
  isPanelFooter: false
};

export default DashboardModalFooter;
