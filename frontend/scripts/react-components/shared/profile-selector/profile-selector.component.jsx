import React from 'react';
import PropTypes from 'prop-types';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import { PROFILE_STEPS } from 'constants';
import ProfilePanel from 'react-components/shared/profile-selector/profile-panel';
import StepsTracker from 'react-components/shared/steps-tracker';
import 'react-components/shared/profile-selector/profile-selector.scss';

function ProfilesSelectorModal(props) {
  const { activeStep, onClose, setStep } = props;
  const showBackButton = activeStep > PROFILE_STEPS.types;
  const goToProfiles = onClose; // TODO: Go to profiles page
  const onContinue =
    activeStep === PROFILE_STEPS.commodities ? goToProfiles : () => setStep(activeStep + 1);
  const isOpen = activeStep !== null;
  return (
    <SimpleModal isOpen={isOpen} onRequestClose={onClose}>
      <div className="c-profile-selector">
        <StepsTracker
          steps={['Type', 'Commodity'].map(label => ({ label }))}
          activeStep={activeStep}
        />
        <ProfilePanel
          step={activeStep}
          onContinue={onContinue}
          onBack={showBackButton ? () => setStep(activeStep - 1) : undefined}
        />
      </div>
    </SimpleModal>
  );
}

ProfilesSelectorModal.propTypes = {
  activeStep: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired
};

export default ProfilesSelectorModal;
