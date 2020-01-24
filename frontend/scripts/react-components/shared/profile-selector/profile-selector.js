import { connect } from 'react-redux';
import ProfileSelectorComponent from 'react-components/shared/profile-selector/profile-selector.component';
import {
  setProfilesActiveStep,
  goToProfile
} from 'react-components/shared/profile-selector/profile-selector.register';
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
  onClose: () => setProfilesActiveStep(null),
  setStep: setProfilesActiveStep,
  goToProfile
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSelectorComponent);
