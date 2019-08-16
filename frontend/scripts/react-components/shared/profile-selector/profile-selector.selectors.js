import { createSelector } from 'reselect';
import { PROFILE_STEPS } from 'constants';

import { makeGetPanelActiveTab, makeGetPanelTabs } from 'selectors/panel.selectors';

const getProfileSelectorTabs = state => state.profileSelector.tabs;
const getCompaniesPanel = state => state.profileSelector.panels.companies;
const getSourcesPanel = state => state.profileSelector.panels.sources;
const getCountriesPanel = state => state.profileSelector.panels.countries;

const getCountriesData = state => state.profileSelector.data.countries;
const getSourcesData = state => state.profileSelector.data.sources;
const getCompaniesData = state => state.profileSelector.data.companies;

const getSourcesTab = state => state.profileSelector.panels.sources.activeTab;
const getCompaniesTab = state => state.profileSelector.panels.companies.activeTab;

const getActiveStep = state => state.profileSelector.activeStep;
const getPanels = state => state.profileSelector.panels;
const getProfileType = state => state.profileSelector.panels.type;

export const getSourcesTabs = makeGetPanelTabs(getProfileSelectorTabs, () => 'sources');
export const getCompaniesTabs = makeGetPanelTabs(getProfileSelectorTabs, () => 'companies');
export const getSourcesActiveTab = makeGetPanelActiveTab(
  getSourcesTab,
  getProfileSelectorTabs,
  () => 'sources'
);
export const getCompaniesActiveTab = makeGetPanelActiveTab(
  getCompaniesTab,
  getProfileSelectorTabs,
  () => 'companies'
);

export const getCompaniesCountryData = createSelector(
  [getCompaniesData, getCountriesData, getCountriesPanel],
  (companiesData, countriesData, countriesPanel) => {
    let countryId;
    if (countriesPanel.activeItems.length > 0) {
      [countryId] = countriesPanel.activeItems;
    } else if (countriesData.length > 0) {
      [{ id: countryId }] = countriesData;
    }
    if (countryId) {
      return companiesData[countryId] || {};
    }
    return [];
  }
);

export const getCompaniesActiveData = createSelector(
  [getCompaniesCountryData, getCompaniesActiveTab],
  (companiesCountryData, companiesActiveTab) => companiesCountryData[companiesActiveTab] || []
);

export const getCountriesActiveItems = createSelector(
  [getCountriesPanel, getCountriesData],
  (panel, data) => {
    if (data.length === 0 || panel.activeItems.length === 0) {
      return null;
    }
    const dict = data.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
    const items = panel.activeItems
      .map(id => dict[id] && { ...dict[id], name: dict[id].name.toLowerCase() })
      .filter(Boolean);

    return items.length > 0 ? items : null;
  }
);

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

export const getSourcesActiveItems = createSelector(
  [getSourcesPanel, getSourcesData],
  getPanelActiveTabItems
);
export const getCompaniesActiveItems = createSelector(
  [getCompaniesPanel, getCompaniesCountryData],
  getPanelActiveTabItems
);

export const getIsDisabled = createSelector(
  [getActiveStep, getPanels, getProfileType],
  (step, panels, profileType) => {
    switch (step) {
      case PROFILE_STEPS.type:
        return !profileType;
      case PROFILE_STEPS.profiles: {
        // As we dont have a country profile page the min requirement is the sourcesPanel selection
        return panels[profileType] && panels[profileType].activeItems.length === 0;
      }
      case PROFILE_STEPS.commodities:
        return panels.commodities.activeItems.length === 0;
      default:
        return !profileType;
    }
  }
);

export const getDynamicSentence = createSelector(
  [getSourcesActiveItems, getCompaniesActiveItems, getProfileType],
  (sourcesActiveItems, companiesActiveItems, profileType) => {
    if (
      (profileType === 'sources' && !sourcesActiveItems) ||
      (profileType === 'companies' && !companiesActiveItems)
    ) {
      return [];
    }
    const dynamicParts = [];
    if (profileType === 'sources' && sourcesActiveItems.length > 0) {
      dynamicParts.push({
        panel: 'sources',
        id: 'sources',
        prefix: 'See the',
        transform: 'capitalize',
        value: sourcesActiveItems
      });
    } else if (profileType === 'companies' && companiesActiveItems.length > 0) {
      dynamicParts.push({
        panel: 'companies',
        id: 'companies',
        prefix: 'See the',
        transform: 'capitalize',
        value: companiesActiveItems
      });
    }

    if (dynamicParts.length > 0) {
      dynamicParts.push({
        prefix: 'profile'
      });
    }

    return dynamicParts;
  }
);
