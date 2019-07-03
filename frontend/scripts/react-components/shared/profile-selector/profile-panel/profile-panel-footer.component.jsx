import React from 'react';
import PropTypes from 'prop-types';
import 'react-components/shared/profile-selector/profile-panel/profile-panel-footer.scss';
import Text from 'react-components/shared/text';
import Button from 'react-components/shared/button';

function ProfilePanelFooter(props) {
  const { onContinue, onBack, isDisabled, isLastStep } = props;

  return (
    <div className="c-profile-panel-footer">
      {onBack && (
        <button type="button" onClick={onBack} className="profile-panel-back-button">
          <Text as="span" size="rg" variant="mono">
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
        <Text as="span" size="rg" color="white" variant="mono">
          {isLastStep ? 'Go to dashboard' : 'Continue'}
        </Text>
      </Button>
    </div>
  );
}

ProfilePanelFooter.propTypes = {
  onBack: PropTypes.func,
  onContinue: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isLastStep: PropTypes.bool
};

export default ProfilePanelFooter;
