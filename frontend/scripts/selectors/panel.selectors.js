import { createSelector } from 'reselect';

export const makeGetPanelActiveTab = (getPanel, getTabs, getPanelId) =>
  createSelector(
    [getPanel, getTabs, getPanelId],
    (panel, tabs, panelId) => {
      const panelTabs = tabs[panelId];
      if (panel.activeTab) {
        return panel.activeTab;
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

const getPanelActiveItems = (panel, data) => {
  if (data.length === 0 || panel.activeItems.length === 0) {
    return null;
  }
  const dict = data.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
  const items = panel.activeItems
    .map(id => dict[id] && { ...dict[id], name: dict[id].name.toLowerCase() })
    .filter(Boolean);

  return items.length > 0 ? items : null;
};

const getPanelActiveTabItems = (panel, data) => {
  if (
    Object.keys(data).length === 0 ||
    panel.activeItems.length === 0 ||
    !panel.activeTab ||
    !data[panel.activeTab]
  ) {
    return null;
  }
  const list = data[panel.activeTab];
  const dict = list.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
  const items = panel.activeItems
    .map(id => dict[id] && { ...dict[id], name: dict[id].name.toLowerCase() })
    .filter(Boolean);

  if (items.length > 0) {
    return items;
  }

  return null;
};

export const makeGetPanelActiveItems = (getPanel, getData) =>
  createSelector(
    [getPanel, getData],
    getPanelActiveItems
  );

export const makeGetPanelActiveTabItems = (getPanel, getData) =>
  createSelector(
    [getPanel, getData],
    getPanelActiveTabItems
  );
