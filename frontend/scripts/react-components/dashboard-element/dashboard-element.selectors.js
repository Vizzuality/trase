import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';

const getCountriesPanel = state => state.dashboardElement.countriesPanel;
const getSourcesPanel = state => state.dashboardElement.sourcesPanel;
const getDestinationsPanel = state => state.dashboardElement.destinationsPanel;
const getCompaniesPanel = state => state.dashboardElement.companiesPanel;
const getCommoditiesPanel = state => state.dashboardElement.commoditiesPanel;
const getIndicators = state => state.dashboardElement.data.indicators;
const getActiveIndicators = state => state.dashboardElement.activeIndicatorsList;
const getDashboardPanelTabs = state => state.dashboardElement.tabs;
const getActiveDashboardPanel = state => {
  const { activePanelId, ...restState } = state.dashboardElement;
  return { id: activePanelId, ...restState[`${activePanelId}Panel`] };
};
const getIndicatorsMeta = state => state.dashboardElement.meta.indicators;

export const getActivePanelTabs = createSelector(
  [getActiveDashboardPanel, getDashboardPanelTabs],
  (panel, tabs) => tabs[panel.id] || []
);

export const getDirtyBlocks = createSelector(
  [
    getCountriesPanel,
    getSourcesPanel,
    getDestinationsPanel,
    getCompaniesPanel,
    getCommoditiesPanel
  ],
  (countriesPanel, sourcesPanel, destinationsPanel, companiesPanel, commoditiesPanel) => ({
    sources: !isEmpty(countriesPanel.activeItems),
    destinations: !isEmpty(destinationsPanel.activeItems),
    companies: !isEmpty(companiesPanel.activeItems),
    commodities: !isEmpty(commoditiesPanel.activeItems)
  })
);

const getActivePanelItem = (panels, panelName, nodeType) => {
  if (
    !panels[panelName] ||
    !panels[panelName].activeItems ||
    isEmpty(panels[panelName].activeItems)
  )
    return null;
  const values = Object.values(panels[panelName].activeItems);
  if (nodeType) {
    const filteredValues = values.filter(i => i.nodeType === nodeType);
    return filteredValues.length > 0 ? filteredValues : null;
  }
  return values;
};

export const getDynamicSentence = createSelector(
  [
    getDirtyBlocks,
    getCountriesPanel,
    getSourcesPanel,
    getDestinationsPanel,
    getCompaniesPanel,
    getCommoditiesPanel
  ],
  (
    dirtyBlocks,
    countriesPanel,
    sourcesPanel,
    destinationsPanel,
    companiesPanel,
    commoditiesPanel
  ) => {
    if (Object.values(dirtyBlocks).every(block => !block)) {
      return [];
    }
    const panels = {
      countries: countriesPanel,
      sources: sourcesPanel,
      destinations: destinationsPanel,
      companies: companiesPanel,
      commodities: commoditiesPanel
    };
    const getActiveItems = panelName => getActivePanelItem(panels, panelName);
    const sourcesValue = getActiveItems('sources') || getActiveItems('countries');

    return [
      {
        panel: 'commodities',
        id: 'commodities',
        prefix: `Your dashboard will include ${getActiveItems('commodities') ? '' : 'commodities'}`,
        value: getActiveItems('commodities')
      },
      {
        panel: 'sources',
        id: 'sources',
        prefix: sourcesValue ? `produced in` : 'produced in countries covered by Trase',
        value: sourcesValue
      },
      {
        panel: 'companies',
        id: 'exporting-companies',
        prefix: getActiveItems('companies', 'EXPORTER') ? 'exported by' : '',
        value: getActiveItems('companies', 'EXPORTER')
      },
      {
        panel: 'companies',
        id: 'importing-companies',
        prefix: getActiveItems('companies', 'IMPORTER') ? 'imported by' : '',
        value: getActiveItems('companies', 'IMPORTER')
      },
      {
        panel: 'destinations',
        id: 'destinations',
        prefix: getActiveItems('destinations') ? `going to` : '',
        value: getActiveItems('destinations')
      }
    ];
  }
);

export const getActiveIndicatorsData = createSelector(
  [getIndicators, getActiveIndicators],
  (indicators, activeIndicatorsList) =>
    indicators.filter(indicator => activeIndicatorsList.includes(indicator.id))
);

export const getIndicatorsByGroup = createSelector(
  [getIndicators, getIndicatorsMeta],
  (indicators, groups) => {
    const sortedIndicators = (sortBy(indicators, ['groupId']) || []).map(
      ({ displayName, ...item }) => ({ name: displayName, ...item })
    );
    const sortedGroups = (sortBy(groups || [], ['id']) || []).map(g => ({ ...g, group: true }));
    const groupedIndicators = sortedGroups.reduce(
      (acc, next) => {
        const index = acc.findIndex(i => i.groupId === next.id);
        const result = [...acc];
        if (index > -1) {
          result.splice(index, 0, next);
        }
        return result;
      },
      [...sortedIndicators]
    );

    return groupedIndicators;
  }
);
