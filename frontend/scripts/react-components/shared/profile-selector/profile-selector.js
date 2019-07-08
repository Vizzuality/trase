import { connect } from 'react-redux';
import ProfileSelectorComponent from 'react-components/shared/profile-selector/profile-selector.component';
import { setProfilesActiveStep } from 'react-components/shared/profile-selector/profile-selector.actions';
import { getIsDisabled } from 'react-components/shared/profile-selector/profile-selector.selectors';

const mapStateToProps = state => ({
  activeStep: state.profileSelector.activeStep,
  isDisabled: getIsDisabled(state)
});

const mapDispatchToProps = {
  onClose: () => setProfilesActiveStep(null),
  setStep: setProfilesActiveStep
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSelectorComponent);
