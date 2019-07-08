import { createSelector } from 'reselect';
import { PROFILE_STEPS } from 'constants';
import isEmpty from 'lodash/isEmpty';

const getActiveStep = state => state.profileSelector.activeStep;
const getPanels = state => state.profileSelector.panels;
const getProfileType = state => state.profileSelector.panels.types.activeItems.type;

export const getIsDisabled = createSelector(
  [getActiveStep, getPanels, getProfileType],
  (step, panels, profileType) => {
    switch (step) {
      case PROFILE_STEPS.types:
        return !profileType;
      case PROFILE_STEPS.profiles: {
        // As we dont have a country profile page the requisite is the sourcesPanel selection
        return panels[profileType] && isEmpty(panels[profileType].activeItems);
      }
      case PROFILE_STEPS.commodities:
        return isEmpty(panels.commodities.activeItems);
      default:
        return !profileType;
    }
  }
);
