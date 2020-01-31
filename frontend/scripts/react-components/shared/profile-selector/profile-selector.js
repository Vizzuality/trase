import { connect } from 'react-redux';
import ProfileSelectorComponent from 'react-components/shared/profile-selector/profile-selector.component';
import { profileSelectorActions } from 'react-components/shared/profile-selector/profile-selector.register';
import {
  getIsDisabled,
  getDynamicSentence
} from 'react-components/shared/profile-selector/profile-selector.selectors';

const mapStateToProps = state => ({
  activeStep: state.profileSelector.activeStep,
  isDisabled: getIsDisabled(state),
  dynamicSentenceParts: getDynamicSentence(state)
});

const mapDispatchToProps = {
  onClose: () => profileSelectorActions.setProfilesActiveStep(null),
  setStep: profileSelectorActions.setProfilesActiveStep,
  goToProfile: profileSelectorActions.goToProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSelectorComponent);
