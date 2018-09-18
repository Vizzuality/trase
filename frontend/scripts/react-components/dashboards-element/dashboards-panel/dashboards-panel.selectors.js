import { createSelector, createStructuredSelector } from 'reselect';

const getSourcingPanel = state => state.dashboardsElement.sourcingPanel;
const getImportingPanel = state => state.dashboardsElement.importingPanel;
const getCompaniesPanel = state => state.dashboardsElement.companiesPanel;
const getCommoditiesPanel = state => state.dashboardsElement.commoditiesPanel;

export const getDashboardsPanels = createStructuredSelector({
  sourcingPanel: getSourcingPanel,
  importingPanel: getImportingPanel,
  companiesPanel: getCompaniesPanel,
  commoditiesPanel: getCommoditiesPanel
});

export const getDirtyBlocks = createSelector(
  getDashboardsPanels,
  ({ sourcingPanel, importingPanel, companiesPanel, commoditiesPanel }) => ({
    sourcing: sourcingPanel.activeCountryItemId !== null,
    importing: importingPanel.activeJurisdictionItemId !== null,
    companies: companiesPanel.activeCompanyItemId !== null,
    commodities: commoditiesPanel.activeCommodityItemId !== null
  })
);
