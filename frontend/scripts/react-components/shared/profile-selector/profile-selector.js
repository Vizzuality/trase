import { connect } from 'react-redux';
import ProfileSelectorComponent from 'react-components/shared/profile-selector/profile-selector.component';
import { setProfilesActiveStep } from 'react-components/shared/profile-selector/profile-selector.actions';

const mapStateToProps = state => ({
  activeStep: state.profileSelector.activeStep
});

const mapDispatchToProps = {
  onClose: () => setProfilesActiveStep(null),
  setStep: setProfilesActiveStep
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSelectorComponent);
