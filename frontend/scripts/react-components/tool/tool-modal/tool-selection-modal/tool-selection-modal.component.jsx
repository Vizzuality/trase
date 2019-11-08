import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TOOL_STEPS } from 'constants';
import ToolPanel from 'react-components/tool/tool-modal/tool-selection-modal/tool-panel';

function ToolSelectionModal({ canProceed, setActiveModal }) {
  const [step, setStep] = useState(TOOL_STEPS.welcome);
  const closeModal = () => {
    setActiveModal(null);
  };
  const showBackButton = step > TOOL_STEPS.sources;
  const onContinue = step === TOOL_STEPS.importers ? closeModal : () => setStep(step + 1);
  return (
    <ToolPanel
      step={step}
      canProceed={canProceed}
      onContinue={onContinue}
      onBack={showBackButton ? () => setStep(step - 1) : undefined}
      setStep={setStep}
      closeModal={closeModal}
    />
  );
}

ToolSelectionModal.propTypes = {
  canProceed: PropTypes.bool,
  setActiveModal: PropTypes.func
};

export default ToolSelectionModal;
