import React from 'react';
import PropTypes from 'prop-types';
import TagsGroup from 'react-components/shared/tags-group';
import Button from 'react-components/shared/button/button.component';
import Text from 'react-components/shared/text/text.component';
import { DASHBOARD_STEPS } from 'constants';
import './dashboard-modal-footer.scss';

function DashboardModalFooter(props) {
  const {
    isLastStep,
    canProceed,
    draftDynamicSentenceParts,
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
        tags={draftDynamicSentenceParts}
        removeSentenceItem={removeSentenceItem}
        clearPanel={clearPanel}
        step={step}
        placement="top-end"
        readOnly={step === DASHBOARD_STEPS.welcome}
      />
      <div className="dashboard-modal-actions">
        {onBack && (
          <button type="button" onClick={onBack} className="dashboard-modal-back-button">
            <Text as="span" size="rg" variant="mono">
              {backText || 'Back To Options'}
            </Text>
          </button>
        )}
        {!isLastStep && (
          <Button
            onClick={() => onContinue()}
            color="gray"
            size="rg"
            disabled={isDisabled}
            className="dashboard-modal-continue-button"
            testId="dashboard-modal-actions-continue"
          >
            Continue
          </Button>
        )}
        {canProceed && (
          <Button
            onClick={() => onContinue(canProceed)}
            color="pink"
            size={isLastStep ? 'md' : 'rg'}
            disabled={isDisabled}
            testId="dashboard-modal-actions-save"
          >
            <Text as="span" size="rg" color="white" variant="mono">
              Save
            </Text>
          </Button>
        )}
      </div>
    </div>
  );
}

DashboardModalFooter.propTypes = {
  onBack: PropTypes.func,
  removeSentenceItem: PropTypes.func,
  clearPanel: PropTypes.func,
  isDisabled: PropTypes.bool,
  isLastStep: PropTypes.bool.isRequired,
  draftDynamicSentenceParts: PropTypes.array,
  onContinue: PropTypes.func.isRequired,
  step: PropTypes.number,
  backText: PropTypes.string
};

export default DashboardModalFooter;
