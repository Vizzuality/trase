import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import flatten from 'lodash/flatten';

const getDashboardPanelData = state => state.dashboardElement.data;
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
  [getSourcesPanel, getDestinationsPanel, getCompaniesPanel, getCommoditiesPanel],
  (sourcesPanel, destinationsPanel, companiesPanel, commoditiesPanel) => ({
    sources: sourcesPanel.activeCountryItemId !== null,
    destinations: destinationsPanel.activeDestinationItemId !== null,
    companies: companiesPanel.activeCompanyItemId !== null,
    commodities: commoditiesPanel.activeCommodityItemId !== null
  })
);

export const getDynamicSentence = createSelector(
  [
    getSourcesPanel,
    getDestinationsPanel,
    getCompaniesPanel,
    getCommoditiesPanel,
    getDashboardPanelData
  ],
  (sourcesPanel, destinationsPanel, companiesPanel, commoditiesPanel, data) => {
    const countriesActiveId = sourcesPanel.activeCountryItemId;
    const sourcesActiveId = sourcesPanel.activeSourceItemId;
    const destinationsActiveId = destinationsPanel.activeDestinationItemId;
    const companiesActiveId = companiesPanel.activeCompanyItemId;
    const commoditiesActiveId = commoditiesPanel.activeCommodityItemId;
    const sources = flatten(Object.values(data.sources));
    const companies = flatten(Object.values(data.companies));

    if (
      ![
        !!countriesActiveId,
        !!sourcesActiveId,
        !!destinationsActiveId,
        !!companiesActiveId,
        !!commoditiesActiveId
      ].includes(true)
    ) {
      return null;
    }
    const countriesValue = data.countries.find(item => item.id === countriesActiveId);
    const commoditiesValue = data.commodities.find(item => item.id === commoditiesActiveId);
    const sourcesValue = sources.find(item => item.id === sourcesActiveId);
    const companiesValue = companies.find(item => item.id === companiesActiveId);
    const destinationsValue = data.destinations.find(item => item.id === destinationsActiveId);

    return [
      {
        panel: 'commodities',
        prefix: commoditiesActiveId ? 'Explore' : 'Explore commodities',
        value: commoditiesValue && commoditiesValue.name.toLowerCase()
      },
      {
        panel: 'sources',
        prefix: sourcesActiveId || countriesActiveId ? `produced in` : 'produced worldwide',
        value:
          (sourcesValue && sourcesValue.name.toLowerCase()) ||
          (countriesValue && countriesValue.name.toLowerCase())
      },
      {
        panel: 'companies',
        prefix:
          companiesActiveId && companiesValue
            ? `${companiesValue.nodeType.toLowerCase() === 'exporter' ? 'exported' : 'imported'} by`
            : '',
        value: companiesValue && companiesValue.name.toLowerCase()
      },
      {
        panel: 'destinations',
        prefix: destinationsActiveId ? `going to` : '',
        value: destinationsValue && destinationsValue.name.toLowerCase()
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
