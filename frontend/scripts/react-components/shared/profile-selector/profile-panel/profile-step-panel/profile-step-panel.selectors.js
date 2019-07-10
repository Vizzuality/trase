import { createSelector } from 'reselect';

const getProfilePanelTabs = state => state.profileSelector.tabs;
const getActiveProfileName = state => state.profileSelector.panels.types.activeItems.type;

export const getActivePanelTabs = createSelector(
  [getActiveProfileName, getProfilePanelTabs],
  (panel, tabs) => tabs[panel] || []
);
