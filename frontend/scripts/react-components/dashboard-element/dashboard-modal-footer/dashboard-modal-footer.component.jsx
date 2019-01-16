import React from 'react';
import PropTypes from 'prop-types';
import TagsGroup from 'react-components/shared/tags-group/tags-group.component';
import Button from 'react-components/shared/button/button.component';

import './dashboard-modal-footer.scss';

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
      {(!editMode || isPanelFooter) && (
        <TagsGroup tags={dynamicSentenceParts} clearItem={clearItem} />
      )}
      <div className="dashboard-modal-actions">
        {onBack && !editMode && (
          <button type="button" onClick={onBack} className="dashboard-modal-back-button">
            Back To Options
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
