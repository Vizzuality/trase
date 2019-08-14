import { createSelector } from 'reselect';

export const makeGetPanelActiveTab = (getTab, getTabs, getPanelId) =>
  createSelector(
    [getTab, getTabs, getPanelId],
    (activeTab, tabs, panelId) => {
      const panelTabs = tabs[panelId];
      if (activeTab) {
        return activeTab;
      }
      if (panelTabs?.length > 0) {
        return panelTabs[0].id;
      }
      return null;
    }
  );

export const makeGetPanelTabs = (getTabs, getPanelId) =>
  createSelector(
    [getTabs, getPanelId],
    (tabs, panelId) => tabs[panelId] || []
  );
