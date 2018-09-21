import { createSelector, createStructuredSelector } from 'reselect';

const getSourcingPanel = state => state.dashboardElement.sourcingPanel;
const getImportingPanel = state => state.dashboardElement.importingPanel;
const getCompaniesPanel = state => state.dashboardElement.companiesPanel;
const getCommoditiesPanel = state => state.dashboardElement.commoditiesPanel;

export const getDashboardPanels = createStructuredSelector({
  sourcingPanel: getSourcingPanel,
  importingPanel: getImportingPanel,
  companiesPanel: getCompaniesPanel,
  commoditiesPanel: getCommoditiesPanel
});

export const getDirtyBlocks = createSelector(
  getDashboardPanels,
  ({ sourcingPanel, importingPanel, companiesPanel, commoditiesPanel }) => ({
    sourcing: sourcingPanel.activeCountryItemId !== null,
    importing: importingPanel.activeJurisdictionItemId !== null,
    companies: companiesPanel.activeCompanyItemId !== null,
    commodities: commoditiesPanel.activeCommodityItemId !== null
  })
);

export const getDynamicSentence = createSelector(
  getDashboardPanels,
  ({ sourcingPanel, importingPanel, companiesPanel, commoditiesPanel }) => {
    const sourcingActiveId =
      sourcingPanel.activeJurisdictionItemId || sourcingPanel.activeCountryItemId;
    const importingActiveId = importingPanel.activeJurisdictionItemId;
    const companiesActiveId = companiesPanel.activeCompanyItemId;
    const commoditiesActiveId = commoditiesPanel.activeCommodityItemId;

    if (
      ![
        !!sourcingActiveId,
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
        panel: 'sourcing',
        prefix: sourcingActiveId ? `produced in` : 'produced in the world',
        value: sourcingActiveId
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
