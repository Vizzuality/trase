import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import range from 'lodash/range';
import capitalize from 'lodash/capitalize';
import { getPanelId } from 'utils/dashboardPanel';
import { makeGetResizeByItems, makeGetRecolorByItems } from 'selectors/indicators.selectors';
import { makeGetAvailableYears } from 'selectors/years.selectors';

const getCountriesData = state => state.dashboardElement.data.countries;
const getSourcesData = state => state.dashboardElement.data.sources;
const getCommoditiesData = state => state.dashboardElement.data.commodities;
const getCompaniesData = state => state.dashboardElement.data.companies;
const getDestinationsData = state => state.dashboardElement.data.destinations;

const getCountriesPanel = state => state.dashboardElement.countriesPanel;

const getSourcesPanel = state => state.dashboardElement.sourcesPanel;
const getDestinationsPanel = state => state.dashboardElement.destinationsPanel;
const getCompaniesPanel = state => state.dashboardElement.companiesPanel;
const getCommoditiesPanel = state => state.dashboardElement.commoditiesPanel;
const getDashboardPanelTabs = state => state.dashboardElement.tabs;
const getActiveDashboardPanel = state => {
  const { activePanelId, ...restState } = state.dashboardElement;
  return { id: activePanelId, ...restState[`${activePanelId}Panel`] };
};
const getAppContexts = state => state.app.contexts;
const getSelectedYears = state => state.dashboardElement.selectedYears;
const getSelectedResizeBy = state => state.dashboardElement.selectedResizeBy;
const getSelectedRecolorBy = state => state.dashboardElement.selectedRecolorBy;
const getDashboardCharts = state => state.dashboardElement.charts;

export const getEditMode = state => state.dashboardElement.editMode;

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
    countries: countriesPanel.activeItems.length > 0,
    sources: sourcesPanel.activeItems.length > 0,
    destinations: destinationsPanel.activeItems.length > 0,
    companies: companiesPanel.activeItems.length > 0,
    commodities: commoditiesPanel.activeItems.length > 0
  })
);

const getPanelActiveItems = (panel, data) => {
  const hasTabs = !Array.isArray(data);

  if (
    (hasTabs && Object.keys(data).length === 0) ||
    (!hasTabs && data.length === 0) ||
    panel.activeItems.length === 0 ||
    (hasTabs && !panel.activeTab) ||
    (hasTabs && !data[panel.activeTab])
  ) {
    return null;
  }
  const list = hasTabs ? data[panel.activeTab] : data;
  const dict = list.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
  const items = panel.activeItems
    .map(id => dict[id] && { ...dict[id], name: dict[id].name.toLowerCase() })
    .filter(Boolean);

  return items.length > 0 ? items : null;
};

export const getCountriesActiveItems = createSelector(
  [getCountriesPanel, getCountriesData],
  getPanelActiveItems
);

const getSourcesActiveItems = createSelector(
  [getSourcesPanel, getSourcesData],
  getPanelActiveItems
);

const getCommoditiesActiveItems = createSelector(
  [getCommoditiesPanel, getCommoditiesData],
  getPanelActiveItems
);

const getCompaniesActiveItems = createSelector(
  [getCompaniesPanel, getCompaniesData],
  (panel, data) => {
    const activeItems = getPanelActiveItems(panel, data);
    if (!activeItems) {
      return null;
    }
    return activeItems.reduce((acc, next) => {
      const nodeType = `${next.nodeType}`.toLowerCase();
      const items = acc[nodeType] || [];
      return {
        ...acc,
        [nodeType]: [...items, next]
      };
    }, {});
  }
);

const getDestinationsActiveItems = createSelector(
  [getDestinationsPanel, getDestinationsData],
  getPanelActiveItems
);

export const getDashboardPanelsValues = createStructuredSelector({
  countries: getCountriesActiveItems,
  sources: getSourcesActiveItems,
  commodities: getCommoditiesActiveItems,
  companies: getCompaniesActiveItems,
  destinations: getDestinationsActiveItems
});

export const getDynamicSentence = createSelector(
  [getDirtyBlocks, getDashboardPanelsValues, getEditMode],
  (dirtyBlocks, panelsValues, editMode) => {
    if (Object.values(dirtyBlocks).every(block => !block)) {
      return [];
    }
    const commoditiesPanelSentence = `${panelsValues.commodities ? '' : 'commodities'}`;
    const commoditiesPrefix = editMode
      ? capitalize(commoditiesPanelSentence)
      : `Your dashboard will include ${commoditiesPanelSentence}`;
    const capitalizeCommodities = editMode ? { transform: 'capitalize' } : {};
    const sourcesValues = panelsValues.sources || panelsValues.countries;
    return [
      {
        panel: 'commodities',
        id: 'commodities',
        prefix: commoditiesPrefix,
        value: panelsValues.commodities,
        ...capitalizeCommodities
      },
      {
        panel: 'sources',
        id: 'sources',
        prefix: sourcesValues ? `produced in` : 'produced in countries covered by Trase',
        value: sourcesValues,
        transform: 'capitalize'
      },
      {
        panel: 'companies',
        id: 'exporting-companies',
        prefix: panelsValues.companies?.exporter ? 'exported by' : '',
        value: panelsValues.companies?.exporter,
        optional: true,
        transform: 'capitalize'
      },
      {
        panel: 'companies',
        id: 'importing-companies',
        prefix: panelsValues.companies?.importer ? 'imported by' : '',
        value: panelsValues.companies?.importer,
        optional: true,
        transform: 'capitalize'
      },
      {
        panel: 'destinations',
        id: 'destinations',
        prefix: panelsValues.destinations ? `going to` : '',
        value: panelsValues.destinations,
        optional: true,
        transform: 'capitalize'
      }
    ];
  }
);

export const getIsDisabled = createSelector(
  [getDynamicSentence, (state, ownProps) => ownProps.step],
  (dynamicSentence, step) => {
    if (dynamicSentence.length === 0 || typeof step === 'undefined') {
      return true;
    }
    const currentPanel = getPanelId(step);
    if (currentPanel === null) {
      return false;
    }
    const currentSentencePart = dynamicSentence.find(p => p.panel === currentPanel);
    if (!currentSentencePart.optional && !currentSentencePart.value) {
      return true;
    }
    return false;
  }
);

export const getDashboardsContext = createSelector(
  [getCountriesActiveItems, getCommoditiesActiveItems, getAppContexts],
  (countriesActiveItems, commoditiesActiveItems, contexts) => {
    const [{ id: countryId } = {}] = countriesActiveItems || [];
    const [{ id: commodityId } = {}] = commoditiesActiveItems || [];
    const context = contexts.find(
      ctx => ctx.countryId === countryId && ctx.commodityId === commodityId
    );

    return context || null;
  }
);

const getDashboardContextResizeBy = createSelector(
  getDashboardsContext,
  context => context && context.resizeBy
);

const getDashboardContextRecolorBy = createSelector(
  getDashboardsContext,
  context => {
    if (!context) return null;
    const emptyOption = {
      position: 0,
      groupNumber: -1,
      label: 'No selection',
      name: 'none',
      years: [],
      value: null,
      attributeId: null
    };
    const contextRecolorByList = context.recolorBy.filter(
      item => !['LR_DEFICIT_PERC_PRIVATE_LAND', 'SMALLHOLDERS'].includes(item.name)
    );

    if (contextRecolorByList.length > 0) {
      return contextRecolorByList.concat(emptyOption);
    }

    return contextRecolorByList.length > 0 ? contextRecolorByList : null;
  }
);

export const getDashboardSelectedResizeBy = createSelector(
  [getSelectedResizeBy, getDashboardContextResizeBy],
  (selectedResizeBy, contextResizeByItems) => {
    if (!contextResizeByItems) {
      const attributeId = selectedResizeBy || null;
      return { label: 'Select an Indicator', value: attributeId, attributeId };
    }

    const itemIncludedInContext = contextResizeByItems.find(
      item => item.attributeId === selectedResizeBy
    );

    if (!selectedResizeBy || !itemIncludedInContext) {
      return contextResizeByItems.find(item => item.isDefault);
    }

    return itemIncludedInContext;
  }
);

export const getDashboardSelectedRecolorBy = createSelector(
  [getSelectedRecolorBy, getDashboardContextRecolorBy],
  (selectedRecolorBy, contextRecolorByItems) => {
    if (!contextRecolorByItems) {
      return null;
    }
    return contextRecolorByItems.find(item => item.attributeId === selectedRecolorBy) || null;
  }
);

export const getDashboardSelectedYears = createSelector(
  [
    getSelectedYears,
    getDashboardsContext,
    makeGetAvailableYears(
      getDashboardSelectedResizeBy,
      getDashboardSelectedRecolorBy,
      getDashboardsContext
    )
  ],
  (selectedYears, context, availableYears) => {
    if (!selectedYears && !context) {
      return [];
    }

    if (context && !selectedYears) {
      return [context.defaultYear, context.defaultYear];
    }

    if (context && selectedYears) {
      const selectedYearsRange = range(selectedYears[0], selectedYears[1] + 1);
      const intersectedYears = intersection(selectedYearsRange, availableYears);
      const selectedAreUnavailable = isEmpty(intersectedYears);

      if (selectedAreUnavailable) {
        return [context.defaultYear, context.defaultYear];
      }

      return [intersectedYears[0], intersectedYears[intersectedYears.length - 1]];
    }

    return selectedYears;
  }
);

export const getDashboardFiltersProps = createStructuredSelector({
  years: makeGetAvailableYears(
    getDashboardSelectedResizeBy,
    getDashboardSelectedRecolorBy,
    getDashboardsContext
  ),
  selectedYears: getDashboardSelectedYears,
  selectedResizeBy: getDashboardSelectedResizeBy,
  selectedRecolorBy: getDashboardSelectedRecolorBy,
  resizeBy: makeGetResizeByItems(getDashboardContextResizeBy, getDashboardSelectedYears),
  recolorBy: makeGetRecolorByItems(getDashboardContextRecolorBy, getDashboardSelectedYears)
});

export const getDashboardGroupedCharts = createSelector(
  [getDashboardCharts],
  charts => {
    if (!charts) {
      return null;
    }
    const {
      data,
      meta: { groupings }
    } = charts;
    const groupingList = Object.values(groupings);
    const groupingsByChartId = groupingList.reduce(
      (acc, grouping) => ({
        ...acc,
        ...grouping.options.reduce((acc2, option) => ({ ...acc2, [option.id]: grouping.id }), {})
      }),
      {}
    );
    const chartsData = data.map((chart, id) => ({
      ...chart,
      id,
      groupingId: typeof groupingsByChartId[id] !== 'undefined' ? groupingsByChartId[id] : null
    }));
    const singleCharts = chartsData.filter(chart => chart.groupingId === null);
    const chartsWithGrouping = chartsData.filter(chart => chart.groupingId !== null);
    const groupedCharts = chartsWithGrouping
      .reduce((acc, chart) => {
        if (!acc[chart.groupingId]) {
          acc[chart.groupingId] = {
            items: {
              [chart.id]: chart
            },
            groupingId: chart.groupingId
          };
        } else {
          acc[chart.groupingId].items[chart.id] = chart;
        }
        return acc;
      }, [])
      .filter(Boolean);
    return {
      groupings,
      charts: [...singleCharts, ...groupedCharts]
    };
  }
);

const getURLDashboardSelectedYears = createSelector(
  [getDashboardSelectedYears, getDashboardsContext],
  (selectedYears, dashboardContext) => {
    if (
      selectedYears[0] === dashboardContext?.defaultYear &&
      selectedYears[1] === dashboardContext?.defaultYear
    ) {
      return null;
    }
    return selectedYears;
  }
);

const getURLDashboardSelectedResizeBy = createSelector(
  [getDashboardSelectedResizeBy, getDashboardsContext],
  (selectedResizeBy, dashboardContext) => {
    const defaultResizeBy = dashboardContext?.resizeBy.find(
      item => item.attributeId === selectedResizeBy.attributeId
    );
    if (defaultResizeBy?.isDefault) {
      return null;
    }
    return selectedResizeBy;
  }
);

export const getDashboardElementUrlProps = createStructuredSelector({
  countriesPanel: getCountriesPanel,
  sourcesPanel: getSourcesPanel,
  commoditiesPanel: getCommoditiesPanel,
  destinationsPanel: getDestinationsPanel,
  selectedYears: getURLDashboardSelectedYears,
  selectedResizeBy: getURLDashboardSelectedResizeBy,
  selectedRecolorBy: getDashboardSelectedRecolorBy
});
