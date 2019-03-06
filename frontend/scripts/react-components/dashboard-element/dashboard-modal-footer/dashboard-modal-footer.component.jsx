import React from 'react';
import PropTypes from 'prop-types';
import TagsGroup from 'react-components/shared/tags-group';
import Button from 'react-components/shared/button/button.component';

import './dashboard-modal-footer.scss';

function DashboardModalFooter(props) {
  const {
    editMode,
    isPanelFooter,
    dynamicSentenceParts,
    clearPanel,
    removeSentenceItem,
    onContinue,
    onBack,
    backText,
    isDisabled,
    step
  } = props;
  return (
    <div className="c-dashboard-modal-footer">
      <TagsGroup
        tags={dynamicSentenceParts}
        removeSentenceItem={removeSentenceItem}
        clearPanel={clearPanel}
        readOnly={!isPanelFooter}
        step={step}
      />
      <div className="dashboard-modal-actions">
        {onBack && !editMode && (
          <button type="button" onClick={onBack} className="dashboard-modal-back-button">
            {backText || 'Back To Options'}
          </button>
        )}
        <Button onClick={onContinue} color="pink" size="md" disabled={isDisabled}>
          {isPanelFooter && !editMode ? 'Continue' : 'Go to dashboard'}
        </Button>
      </div>
    </div>
  );
}

DashboardModalFooter.propTypes = {
  onBack: PropTypes.func,
  removeSentenceItem: PropTypes.func,
  clearPanel: PropTypes.func,
  isDisabled: PropTypes.bool,
  isPanelFooter: PropTypes.bool,
  editMode: PropTypes.bool,
  dynamicSentenceParts: PropTypes.array,
  onContinue: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired,
  backText: PropTypes.string
};

DashboardModalFooter.defaultProps = {
  isPanelFooter: false
};

export default DashboardModalFooter;
