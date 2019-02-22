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

    const getActivePanelItem = panel => {
      const panels = {
        countries: countriesPanel,
        sources: sourcesPanel,
        destinations: destinationsPanel,
        companies: companiesPanel,
        commodities: commoditiesPanel
      };
      // TODO: Show several active Items
      return panels[panel].length > 0 ? panels[panel][0] : null;
    };

    const activeCommodity = getActivePanelItem('commodities');
    const activeCountry = getActivePanelItem('countries');
    const activeSource = getActivePanelItem('sources');
    const activeDestination = getActivePanelItem('destinations');
    const activeCompany = getActivePanelItem('companies');
    return [
      {
        panel: 'commodities',
        id: 'commodities',
        prefix: activeCommodity ? 'Explore' : 'Explore commodities',
        value: activeCommodity && activeCommodity.name.toLowerCase()
      },
      {
        panel: 'sources',
        id: 'sources',
        prefix:
          activeSource || activeCountry ? `produced in` : 'produced in countries covered by Trase',
        value:
          (activeSource && activeSource.name.toLowerCase()) ||
          (activeCountry && activeCountry.name.toLowerCase())
      },
      {
        panel: 'companies',
        id: 'companies',
        prefix: activeCompany
          ? `${activeCompany.nodeType.toLowerCase() === 'exporter' ? 'exported' : 'imported'} by`
          : '',
        value: activeCompany && activeCompany.name.toLowerCase()
      },
      {
        panel: 'destinations',
        id: 'destinations',
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
