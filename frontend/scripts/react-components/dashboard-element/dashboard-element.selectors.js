import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import range from 'lodash/range';
import capitalize from 'lodash/capitalize';
import { getPanelId } from 'utils/dashboardPanel';
import { makeGetResizeByItems, makeGetRecolorByItems } from 'selectors/indicators.selectors';
import { makeGetAvailableYears } from 'selectors/years.selectors';
import pluralize from 'utils/pluralize';
import { getDirtyBlocks } from 'react-components/nodes-panel/nodes-panel.selectors';

const getCountriesData = state => state.nodesPanel.countries.data;
const getSourcesData = state => state.nodesPanel.sources.data;
const getCommoditiesData = state => state.nodesPanel.commodities.data;
const getExportersData = state => state.nodesPanel.exporters.data;
const getImportersData = state => state.nodesPanel.importers.data;
const getDestinationsData = state => state.nodesPanel.destinations.data;

const getSourcesPrefixes = state => state.nodesPanel.sources.prefixes;
const getCommoditiesPrefixes = state => state.nodesPanel.commodities.prefixes;
const getExportersPrefixes = state => state.nodesPanel.exporters.prefixes;
const getImportersPrefixes = state => state.nodesPanel.importers.prefixes;
const getDestinationsPrefixes = state => state.nodesPanel.destinations.prefixes;

const getSourcesExcludingMode = state => state.nodesPanel.sources.excludingMode;
const getExportersExcludingMode = state => state.nodesPanel.exporters.excludingMode;
const getImportersExcludingMode = state => state.nodesPanel.importers.excludingMode;
const getDestinationsExcludingMode = state => state.nodesPanel.destinations.excludingMode;

const getSourcesSelectedNodesIds = state => state.nodesPanel.sources.selectedNodesIds;
const getDestinationsSelectedNodesIds = state => state.nodesPanel.destinations.selectedNodesIds;
const getExportersSelectedNodesIds = state => state.nodesPanel.exporters.selectedNodesIds;
const getImportersSelectedNodesIds = state => state.nodesPanel.importers.selectedNodesIds;

const getSources = state => state.nodesPanel.sources;
const getDestinations = state => state.nodesPanel.destinations;
const getExporters = state => state.nodesPanel.exporters;
const getImporters = state => state.nodesPanel.importers;

const getSelectedCountryId = state => state.nodesPanel.countries.selectedNodeId;
const getSelectedCommodityId = state => state.nodesPanel.commodities.selectedNodeId;

const getSelectedYears = state => state.dashboardElement.selectedYears;
const getSelectedResizeBy = state => state.dashboardElement.selectedResizeBy;
const getSelectedRecolorBy = state => state.dashboardElement.selectedRecolorBy;
const getDashboardCharts = state => state.dashboardElement.charts;

export const getEditMode = state => state.dashboardElement.editMode;

const getAppContexts = state => state.app.contexts;

const getPanelActiveItems = (selectedNodesIds, data) =>
  selectedNodesIds
    .map(id => {
      const item = data.nodes && data.nodes[id];
      if (!item) {
        return null;
      }
      return { ...item, name: `${item.name}`.toLowerCase() };
    })
    .filter(Boolean);

const getSingleActiveItem = (selectedId, data) => {
  const selected = selectedId && data.nodes && data.nodes[selectedId];
  if (selected) {
    return [{ ...selected, name: `${selected.name}`.toLowerCase() }];
  }
  return [];
};

const getCountriesActiveItems = createSelector(
  [getSelectedCountryId, getCountriesData],
  getSingleActiveItem
);

const getCommoditiesActiveItems = createSelector(
  [getSelectedCommodityId, getCommoditiesData],
  getSingleActiveItem
);

const getSourcesActiveItems = createSelector(
  [getSourcesSelectedNodesIds, getSourcesData],
  getPanelActiveItems
);
const getDestinationsActiveItems = createSelector(
  [getDestinationsSelectedNodesIds, getDestinationsData],
  getPanelActiveItems
);
const getExportersActiveItems = createSelector(
  [getExportersSelectedNodesIds, getExportersData],
  getPanelActiveItems
);
const getImportersActiveItems = createSelector(
  [getImportersSelectedNodesIds, getImportersData],
  getPanelActiveItems
);

export const getNodesPanelValues = createStructuredSelector({
  countries: getCountriesActiveItems,
  sources: getSourcesActiveItems,
  commodities: getCommoditiesActiveItems,
  exporters: getExportersActiveItems,
  importers: getImportersActiveItems,
  destinations: getDestinationsActiveItems
});

const getNodesPanelPrefixes = createSelector(
  [
    getSourcesPrefixes,
    getCommoditiesPrefixes,
    getExportersPrefixes,
    getImportersPrefixes,
    getDestinationsPrefixes
  ],
  (sources, commodities, exporters, importers, destinations) => ({
    sources,
    commodities,
    exporters,
    importers,
    destinations
  })
);

const getNodesPanelExcludingMode = createSelector(
  [
    getSourcesExcludingMode,
    getExportersExcludingMode,
    getImportersExcludingMode,
    getDestinationsExcludingMode
  ],
  (sources, exporters, importers, destinations) => ({
    sources,
    exporters,
    importers,
    destinations
  })
);

export const getDynamicSentence = createSelector(
  [
    getDirtyBlocks,
    getNodesPanelValues,
    getEditMode,
    getNodesPanelPrefixes,
    getNodesPanelExcludingMode
  ],
  (dirtyBlocks, panelsValues, editMode, prefixes, excludingModeMap) => {
    if (Object.values(dirtyBlocks).every(block => !block)) {
      return [];
    }
    const commoditiesPanelSentence = `${panelsValues.commodities.length > 0 ? '' : 'commodities'}`;
    const commoditiesPrefix = editMode
      ? capitalize(commoditiesPanelSentence)
      : `Your dashboard will include ${commoditiesPanelSentence}`;
    const capitalizeCommodities = editMode ? { transform: 'capitalize' } : {};
    const sourcesValues =
      panelsValues.sources.length > 0 ? panelsValues.sources : panelsValues.countries;

    const getSettings = (items, prefixesMap, excludingMode, defaultName, defaultPrefix) => {
      const settings = { prefix: defaultPrefix, name: defaultName };
      const [first] = items;
      if (prefixesMap && first) {
        const nodeType = first.nodeType || first.type;
        settings.name = nodeType ? pluralize(nodeType) : defaultName;
        settings.prefix = prefixesMap[nodeType] || defaultPrefix;
      }
      if (excludingMode) {
        if (items.length > 1) {
          settings.prefix = `${settings.prefix} all but`;
        } else {
          settings.prefix = `${settings.prefix} all ${settings.name} except`;
        }
      }
      return settings;
    };

    const sourcesSettings = getSettings(
      panelsValues.sources,
      prefixes.sources,
      excludingModeMap.sources,
      'sources',
      'produced in'
    );
    const exportersSettings = getSettings(
      panelsValues.exporters,
      prefixes.exporters,
      excludingModeMap.exporters,
      'exporters',
      'exported by'
    );
    const importersSettings = getSettings(
      panelsValues.importers,
      prefixes.importers,
      excludingModeMap.importers,
      'importers',
      'imported by'
    );
    const destinationsSettings = getSettings(
      panelsValues.destinations,
      prefixes.destinations,
      excludingModeMap.destinations,
      'destinations',
      'going to'
    );

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
        name: sourcesSettings.name,
        prefix: sourcesValues ? sourcesSettings.prefix : 'produced in countries covered by Trase',
        value: sourcesValues,
        transform: 'capitalize'
      },
      {
        panel: 'exporters',
        id: 'exporters',
        name: exportersSettings.name,
        prefix: panelsValues.exporters.length > 0 ? exportersSettings.prefix : '',
        value: panelsValues.exporters,
        optional: true,
        transform: 'capitalize'
      },
      {
        panel: 'importers',
        id: 'importers',
        name: importersSettings.name,
        prefix: panelsValues.importers.length > 0 ? importersSettings.prefix : '',
        value: panelsValues.importers,
        optional: true,
        transform: 'capitalize'
      },
      {
        panel: 'destinations',
        id: 'destinations',
        name: destinationsSettings.name,
        prefix: panelsValues.destinations.length > 0 ? destinationsSettings.prefix : '',
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
    return !currentSentencePart.optional && !currentSentencePart.value.length > 0;
  }
);

export const getDashboardsContext = createSelector(
  [getSelectedCountryId, getSelectedCommodityId, getAppContexts],
  (selectedCountryId, selectedCommodityId, contexts) => {
    const context = contexts.find(
      ctx => ctx.countryId === selectedCountryId && ctx.commodityId === selectedCommodityId
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
    // TODO: handle this indicators by bucketing either here or preferably in backend
    const contextRecolorByList = context.recolorBy.filter(
      item =>
        !['LR_DEFICIT_PERC_PRIVATE_LAND', 'SMALLHOLDERS', 'SMALLHOLDERS_V2'].includes(item.name)
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

    const contextSelectedRecolorBy = contextRecolorByItems.find(
      item => item.attributeId === selectedRecolorBy
    );

    if (contextSelectedRecolorBy) {
      return contextSelectedRecolorBy;
    }

    return contextRecolorByItems.find(item => item.attributeId === null);
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

const getURLParamsIfContext = (params, context) => {
  if (!context) {
    return null;
  }
  return params;
};

const getURLSources = createSelector(
  [getSources, getDashboardsContext],
  getURLParamsIfContext
);
const getURLExporters = createSelector(
  [getExporters, getDashboardsContext],
  getURLParamsIfContext
);
const getURLImporters = createSelector(
  [getImporters, getDashboardsContext],
  getURLParamsIfContext
);
const getURLDestinations = createSelector(
  [getDestinations, getDashboardsContext],
  getURLParamsIfContext
);

export const getDashboardElementUrlProps = createStructuredSelector({
  sources: getURLSources,
  exporters: getURLExporters,
  importers: getURLImporters,
  countries: getSelectedCountryId,
  destinations: getURLDestinations,
  commodities: getSelectedCommodityId,
  selectedYears: getURLDashboardSelectedYears,
  selectedRecolorBy: getDashboardSelectedRecolorBy,
  selectedResizeBy: getURLDashboardSelectedResizeBy
});
