import { createSelector, createStructuredSelector } from 'reselect';
import uniq from 'lodash/uniq';

const getSourcesPanel = state => state.dashboardElement.sourcesPanel;
const getImportingPanel = state => state.dashboardElement.importingPanel;
const getCompaniesPanel = state => state.dashboardElement.companiesPanel;
const getCommoditiesPanel = state => state.dashboardElement.commoditiesPanel;
const getIndicators = state => state.dashboardElement.data.indicators;
const getActiveIndicators = state => state.dashboardElement.activeIndicatorsList;
const getDashboardPanelMeta = state => state.dashboardElement.meta;
const getActiveDashboardPanel = state => {
  const { activePanelId, ...restState } = state.dashboardElement;
  return { id: activePanelId, ...restState[`${activePanelId}Panel`] };
};

export const getDashboardPanels = createStructuredSelector({
  sourcesPanel: getSourcesPanel,
  importingPanel: getImportingPanel,
  companiesPanel: getCompaniesPanel,
  commoditiesPanel: getCommoditiesPanel
});

export const getActivePanelTabs = createSelector(
  [getActiveDashboardPanel, getDashboardPanelMeta],
  (panel, meta) => {
    switch (panel.id) {
      case 'sources': {
        if (meta.countries) {
          const tabs = meta.countries
            .filter(row => row.country_id === panel.activeCountryItemId && row.node_type_id !== 13)
            .map(row => ({ name: row.node_type_name, id: row.node_type_id }));
          return uniq(tabs);
        }
        return [];
      }
      case 'companies': {
        return ['EXPORTERS', 'IMPORTERS'];
      }
      default:
        return [];
    }
  }
);

export const getDirtyBlocks = createSelector(
  getDashboardPanels,
  ({ sourcesPanel, importingPanel, companiesPanel, commoditiesPanel }) => ({
    sources: sourcesPanel.activeCountryItemId !== null,
    importing: importingPanel.activeSourceItemId !== null,
    companies: companiesPanel.activeCompanyItemId !== null,
    commodities: commoditiesPanel.activeCommodityItemId !== null
  })
);

export const getDynamicSentence = createSelector(
  getDashboardPanels,
  ({ sourcesPanel, importingPanel, companiesPanel, commoditiesPanel }) => {
    const sourcesActiveId = sourcesPanel.activeSourceItemId || sourcesPanel.activeCountryItemId;
    const importingActiveId = importingPanel.activeDestinationItemId;
    const companiesActiveId = companiesPanel.activeCompanyItemId;
    const commoditiesActiveId = commoditiesPanel.activeCommodityItemId;

    if (
      ![
        !!sourcesActiveId,
        !!importingActiveId,
        !!companiesActiveId,
        !!commoditiesActiveId
      ].includes(true)
    ) {
      return null;
    }

    return [
      {
        panel: 'commodities',
        prefix: commoditiesActiveId ? 'Explore' : 'Explore commodities',
        value: commoditiesActiveId
      },
      {
        panel: 'sources',
        prefix: sourcesActiveId ? `produced in` : 'produced in the world',
        value: sourcesActiveId
      },
      {
        panel: 'companies',
        prefix: companiesActiveId ? `exported by` : '',
        value: companiesActiveId
      },
      { panel: 'importing', prefix: importingActiveId ? `going to` : '', value: importingActiveId }
    ];
  }
);

export const getActiveIndicatorsData = createSelector(
  [getIndicators, getActiveIndicators],
  (indicators, activeIndicatorsList) =>
    indicators.filter(indicator => activeIndicatorsList.includes(indicator.id))
);
