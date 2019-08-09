import React from 'react';
import PropTypes from 'prop-types';
import SimpleModal from 'react-components/shared/simple-modal/simple-modal.component';
import { PROFILE_STEPS } from 'constants';
import ProfilePanel from 'react-components/shared/profile-selector/profile-panel';
import StepsTracker from 'react-components/shared/steps-tracker';
import ProfilePanelFooter from 'react-components/shared/profile-selector/profile-panel-footer';
import 'react-components/shared/profile-selector/profile-selector.scss';

function ProfilesSelectorModal(props) {
  const { activeStep, onClose, setStep, isDisabled, dynamicSentenceParts, goToProfile } = props;
  const showBackButton = activeStep > PROFILE_STEPS.type;
  const onContinue =
    activeStep === PROFILE_STEPS.commodities ? goToProfile : () => setStep(activeStep + 1);
  const isOpen = activeStep !== null;
  return (
    <SimpleModal isOpen={isOpen} onRequestClose={onClose}>
      <div className="c-profile-selector">
        <div className="profile-content">
          <StepsTracker
            steps={['Type', 'Profile', 'Commodity'].map(label => ({ label }))}
            activeStep={activeStep || 0}
          />
          <ProfilePanel step={activeStep} />
        </div>
        <ProfilePanelFooter
          onBack={showBackButton ? () => setStep(activeStep - 1) : undefined}
          onContinue={onContinue}
          isDisabled={isDisabled}
          step={activeStep}
          dynamicSentenceParts={dynamicSentenceParts}
        />
      </div>
    </SimpleModal>
  );
}

ProfilesSelectorModal.propTypes = {
  activeStep: PropTypes.number,
  isDisabled: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
  goToProfile: PropTypes.func.isRequired,
  dynamicSentenceParts: PropTypes.array
};

export default ProfilesSelectorModal;
