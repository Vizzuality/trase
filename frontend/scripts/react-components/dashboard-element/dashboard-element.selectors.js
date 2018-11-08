import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';

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
    sources: countriesPanel.activeItem !== null,
    destinations: destinationsPanel.activeItem !== null,
    companies: companiesPanel.activeItem !== null,
    commodities: commoditiesPanel.activeItem !== null
  })
);

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
      return null;
    }

    const activeCountry = countriesPanel.activeItem;
    const activeSource = sourcesPanel.activeItem;
    const activeDestination = destinationsPanel.activeItem;
    const activeCompany = companiesPanel.activeItem;
    const activeCommodity = commoditiesPanel.activeItem;

    return [
      {
        panel: 'commodities',
        prefix: activeCommodity ? 'Explore' : 'Explore commodities',
        value: activeCommodity && activeCommodity.name.toLowerCase()
      },
      {
        panel: 'sources',
        prefix:
          activeSource || activeCountry ? `produced in` : 'produced in countries covered by Trase',
        value:
          (activeSource && activeSource.name.toLowerCase()) ||
          (activeCountry && activeCountry.name.toLowerCase())
      },
      {
        panel: 'companies',
        prefix: activeCompany
          ? `${activeCompany.nodeType.toLowerCase() === 'exporter' ? 'exported' : 'imported'} by`
          : '',
        value: activeCompany && activeCompany.name.toLowerCase()
      },
      {
        panel: 'destinations',
        prefix: activeDestination ? `going to` : '',
        value: activeDestination && activeDestination.name.toLowerCase()
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
