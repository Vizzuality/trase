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

export const getDynamicSentence = createSelector(
  getDashboardsPanels,
  ({ sourcingPanel, importingPanel, companiesPanel, commoditiesPanel }) => {
    let sourcingActiveId = null;
    if (sourcingPanel.activeJurisdictionItemId) {
      sourcingActiveId = { value: sourcingPanel.activeJurisdictionItemId, section: 'jurisdiction' };
    } else if (sourcingPanel.activeCountryItemId) {
      sourcingActiveId = { value: sourcingPanel.activeCountryItemId, section: 'country' };
    }

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
        section: 'commodity',
        prefix: commoditiesActiveId ? 'Explore' : 'Explore commodities',
        value: commoditiesActiveId
      },
      {
        prefix: sourcingActiveId ? `produced in` : '',
        ...sourcingActiveId
      },
      {
        section: 'company',
        prefix: companiesActiveId ? `exported by` : '',
        value: companiesActiveId
      },
      {
        section: 'jurisdiction',
        prefix: importingActiveId ? `going to` : '',
        value: importingActiveId
      }
    ];
  }
);
