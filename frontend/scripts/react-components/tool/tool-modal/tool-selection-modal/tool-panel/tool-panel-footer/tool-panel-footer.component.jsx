import React from 'react';
import PropTypes from 'prop-types';
import TagsGroup from 'react-components/shared/tags-group';
import Button from 'react-components/shared/button/button.component';
import Text from 'react-components/shared/text/text.component';
import './tool-panel-footer.scss';

function ToolPanelFooter(props) {
  const {
    isLastStep,
    dynamicSentenceParts,
    clearPanel,
    removeSentenceItem,
    onContinue,
    onBack,
    backText,
    isDisabled,
    step,
    closeModal
  } = props;

  return (
    <div className="c-tool-panel-footer">
      <TagsGroup
        tags={dynamicSentenceParts}
        removeSentenceItem={removeSentenceItem}
        clearPanel={clearPanel}
        step={step}
        placement="top-end"
      />
      <div className="tool-panel-footer-actions">
        {onBack && (
          <button type="button" onClick={onBack} className="tool-panel-footer-back-button">
            <Text as="span" size="rg" variant="mono">
              {backText || 'Back To Options'}
            </Text>
          </button>
        )}
        <Button
          onClick={isLastStep ? closeModal : onContinue}
          color="pink"
          size="md"
          disabled={isDisabled}
          testId="tool-panel-footer-actions-continue"
        >
          <Text as="span" size="rg" color="white" variant="mono">
            {isLastStep ? 'Save' : 'Continue'}
          </Text>
        </Button>
      </div>
    </div>
  );
}

ToolPanelFooter.propTypes = {
  onBack: PropTypes.func,
  removeSentenceItem: PropTypes.func,
  clearPanel: PropTypes.func,
  isDisabled: PropTypes.bool,
  isLastStep: PropTypes.bool.isRequired,
  dynamicSentenceParts: PropTypes.array,
  onContinue: PropTypes.func.isRequired,
  step: PropTypes.number,
  backText: PropTypes.string,
  closeModal: PropTypes.func
};

export default ToolPanelFooter;
