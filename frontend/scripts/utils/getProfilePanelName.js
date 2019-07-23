import invert from 'lodash/invert';
import { PROFILE_STEPS } from 'constants';

const getPanelStepName = activeStep => invert(PROFILE_STEPS)[activeStep];

export const getPanelName = profileSelector =>
  profileSelector.activeStep === PROFILE_STEPS.profiles
    ? profileSelector.panels.types.activeItems.type
    : getPanelStepName(profileSelector.activeStep);

export default getPanelStepName;
