import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/shared/profile-selector/profile-panel-footer/profile-panel-footer.scss';
import Text from 'react-components/shared/text';
import Button from 'react-components/shared/button';
import TagsGroup from 'react-components/shared/tags-group';
import { PROFILE_STEPS } from 'constants';

function ProfilePanelFooter(props) {
  const { onContinue, onBack, isDisabled, step, dynamicSentenceParts } = props;
  const isLastStep = step === Object.keys(PROFILE_STEPS).length - 1;
  return (
    <div className="c-profile-panel-footer">
      <TagsGroup tags={dynamicSentenceParts} step={step} placement="top-end" suffix="profile" />
      <div className="profile-panel-footer-actions">
        {onBack && (
          <button type="button" onClick={onBack} className="profile-panel-back-button">
            <Text as="span" size="rg" variant="sans">
              Back
            </Text>
          </button>
        )}
        <Button
          onClick={onContinue}
          color="pink"
          size="md"
          disabled={isDisabled}
          testId="dashboard-modal-actions-continue"
        >
          <Text as="span" size="rg" color="white" variant="sans">
            {isLastStep ? 'Go to profile' : 'Continue'}
          </Text>
        </Button>
      </div>
    </div>
  );
}

ProfilePanelFooter.propTypes = {
  onBack: PropTypes.func,
  onContinue: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  step: PropTypes.number,
  dynamicSentenceParts: PropTypes.array
};

export default ProfilePanelFooter;
