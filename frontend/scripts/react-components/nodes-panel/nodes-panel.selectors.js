import { createSelector, createStructuredSelector } from 'reselect';

import modules from 'react-components/nodes-panel/nodes-panel.modules';
import { DASHBOARD_STEPS } from 'constants';
import { getSelectedContext } from 'reducers/app.selectors';

const getCountrySelectedNodeId = state => state.nodesPanel.countries.selectedNodeId;
const getSourcesSelectedNodesIds = state => state.nodesPanel.sources.selectedNodesIds;
const getCommoditySelectedNodeId = state => state.nodesPanel.commodities.selectedNodeId;
const getDestinationsSelectedNodesIds = state => state.nodesPanel.destinations.selectedNodesIds;
const getExportersSelectedNodesIds = state => state.nodesPanel.exporters.selectedNodesIds;
const getImportersSelectedNodesIds = state => state.nodesPanel.importers.selectedNodesIds;

const getCountryDraftSelectedNodeId = state => state.nodesPanel.countries.draftSelectedNodeId;
const getSourcesDraftSelectedNodesIds = state => state.nodesPanel.sources.draftSelectedNodesIds;
const getCommodityDraftSelectedNodeId = state => state.nodesPanel.commodities.draftSelectedNodeId;
const getDestinationsDraftSelectedNodesIds = state =>
  state.nodesPanel.destinations.draftSelectedNodesIds;
const getExportersDraftSelectedNodesIds = state => state.nodesPanel.exporters.draftSelectedNodesIds;
const getImportersDraftSelectedNodesIds = state => state.nodesPanel.importers.draftSelectedNodesIds;

const getSourcesFetchKey = state => state.nodesPanel.sources.fetchKey;
const getCommodityFetchKey = state => state.nodesPanel.commodities.fetchKey;
const getDestinationsFetchKey = state => state.nodesPanel.destinations.fetchKey;
const getExportersFetchKey = state => state.nodesPanel.exporters.fetchKey;
const getImportersFetchKey = state => state.nodesPanel.importers.fetchKey;

const getSources = state => state.nodesPanel.sources;
const getDestinations = state => state.nodesPanel.destinations;
const getExporters = state => state.nodesPanel.exporters;
const getImporters = state => state.nodesPanel.importers;

const makeGetTabs = name => state => state.nodesPanel[name].tabs;

export const getDirtyBlocks = createSelector(
  [
    getCountrySelectedNodeId,
    getCommoditySelectedNodeId,
    getSourcesSelectedNodesIds,
    getDestinationsSelectedNodesIds,
    getImportersSelectedNodesIds,
    getExportersSelectedNodesIds
  ],
  (
    selectedCountryId,
    selectedCommodityId,
    sourcesActiveItems,
    destinationsActiveItems,
    importersActiveItems,
    exportersActiveItems
  ) => ({
    countries: selectedCountryId !== null,
    sources: sourcesActiveItems.length > 0,
    commodities: selectedCommodityId !== null,
    destinations: destinationsActiveItems.length > 0,
    exporters: exportersActiveItems.length > 0,
    importers: importersActiveItems.length > 0
  })
);

export const getDraftDirtyBlocks = createSelector(
  [
    getCountryDraftSelectedNodeId,
    getCommodityDraftSelectedNodeId,
    getSourcesDraftSelectedNodesIds,
    getDestinationsDraftSelectedNodesIds,
    getExportersDraftSelectedNodesIds,
    getImportersDraftSelectedNodesIds
  ],
  (
    selectedCountryId,
    selectedCommodityId,
    sourcesActiveItems,
    destinationsActiveItems,
    importersActiveItems,
    exportersActiveItems
  ) => ({
    countries: selectedCountryId !== null,
    sources: sourcesActiveItems.length > 0,
    commodities: selectedCommodityId !== null,
    destinations: destinationsActiveItems.length > 0,
    exporters: exportersActiveItems.length > 0,
    importers: importersActiveItems.length > 0
  })
);

const makeGetPreviousSteps = name =>
  createSelector(
    [
      getCountryDraftSelectedNodeId,
      getSourcesDraftSelectedNodesIds,
      getCommodityDraftSelectedNodeId,
      getDestinationsDraftSelectedNodesIds,
      getExportersDraftSelectedNodesIds,
      getImportersDraftSelectedNodesIds
    ],
    (...steps) => {
      const currentStep = DASHBOARD_STEPS[name];
      const previousStepsSelectedItems = steps.slice(0, currentStep);
      return previousStepsSelectedItems
        .flatMap(step => {
          if (Array.isArray(step)) {
            return step.join('_');
          }
          return step ? `${step}_` : null;
        })
        .filter(Boolean)
        .join('_');
    }
  );

export const getSourcesPreviousSteps = makeGetPreviousSteps('sources');
export const getCommoditiesPreviousSteps = makeGetPreviousSteps('commodities');
export const getDestinationsPreviousSteps = makeGetPreviousSteps('destinations');
export const getExportersPreviousSteps = makeGetPreviousSteps('exporters');
export const getImportersPreviousSteps = makeGetPreviousSteps('importers');

const getSomeBlocksNeedUpdate = createSelector(
  [
    getSourcesFetchKey,
    getCommodityFetchKey,
    getDestinationsFetchKey,
    getExportersFetchKey,
    getImportersFetchKey,
    getSourcesPreviousSteps,
    getCommoditiesPreviousSteps,
    getDestinationsPreviousSteps,
    getExportersPreviousSteps,
    getImportersPreviousSteps
  ],
  (
    sourcesFetchKey,
    commoditiesFetchKey,
    destinationsFetchKey,
    exportersFetchKey,
    importersFetchKey,
    sourcesPreviousSteps,
    commoditiesPreviousSteps,
    destinationsPreviousSteps,
    exportersPreviousSteps,
    importersPreviousSteps
  ) => {
    const conditions = [
      [null, 'preloaded'].includes(sourcesFetchKey) || sourcesFetchKey === sourcesPreviousSteps,
      [null, 'preloaded'].includes(commoditiesFetchKey) ||
        commoditiesFetchKey === commoditiesPreviousSteps,
      [null, 'preloaded'].includes(destinationsFetchKey) ||
        destinationsFetchKey === destinationsPreviousSteps,
      [null, 'preloaded'].includes(exportersFetchKey) ||
        exportersFetchKey === exportersPreviousSteps,
      [null, 'preloaded'].includes(importersFetchKey) ||
        importersFetchKey === importersPreviousSteps
    ];
    return conditions.includes(false);
  }
);

export const getCanProceed = createSelector(
  [getDraftDirtyBlocks, getSomeBlocksNeedUpdate],
  (dirtyBlocks, someBlocksNeedUpdate) => {
    const mandatoryBlocks = dirtyBlocks.countries && dirtyBlocks.commodities;

    if (mandatoryBlocks && someBlocksNeedUpdate === false) {
      return true;
    }
    return false;
  }
);

export const makeGetActiveTab = name => {
  const getTab = state => state.nodesPanel[name].activeTab;
  const getTabs = makeGetTabs(name);

  return createSelector(
    [getTab, getTabs],
    (activeTab, tabs) => {
      if (activeTab) {
        return activeTab;
      }
      if (tabs?.length > 0) {
        return tabs[0].id;
      }
      return null;
    }
  );
};

export const makeGetNodesPanelsProps = name => {
  const moduleOptions = modules[name];

  const getById = state => state.nodesPanel[name].data.byId;
  const getNodes = state => state.nodesPanel[name].data.nodes;
  const getPage = state => state.nodesPanel[name].page;
  const getLoading = state => state.nodesPanel[name].loadingItems;
  const getNoData = state => state.nodesPanel[name].noData;
  const getTabs = makeGetTabs(name);
  const getSelectedNodeId = state => state.nodesPanel[name].draftSelectedNodeId;
  const getSelectedNodesIds = state => state.nodesPanel[name].draftSelectedNodesIds;
  const getSearchResults = state => state.nodesPanel[name].searchResults;
  const getFetchKey = state => state.nodesPanel[name].fetchKey;
  const getExcludingMode = state => state.nodesPanel[name].excludingMode;
  const getOrderBy = state => state.nodesPanel[name].orderBy;

  const getItems = createSelector(
    [getById, getNodes],
    (byId, nodes) => byId.map(id => nodes[id])
  );

  const getActiveTab = makeGetActiveTab(name);

  const getItemsByTab = createSelector(
    [getItems, getTabs, getActiveTab],
    (data, tabs, activeTab) => {
      const tab = tabs.find(t => t.id === activeTab);
      if (tab) {
        return data.filter(item => item.nodeType === tab.name || item.type === tab.name);
      }
      return [];
    }
  );

  const getSelectedOrderBy = createSelector(
    [getOrderBy],
    orderBy => ({
      id: orderBy,
      label: orderBy === 'name' ? 'Name' : 'Trade Volume',
      value: orderBy
    })
  );

  const getPreviousSteps = makeGetPreviousSteps(name);

  const selectors = {
    page: getPage,
    loading: getLoading,
    noData: getNoData,
    fetchKey: getFetchKey,
    orderBy: getSelectedOrderBy,
    previousSteps: getPreviousSteps
  };

  if (moduleOptions.hasTabs) {
    selectors[name] = getItemsByTab;
    selectors.activeTab = getActiveTab;
    selectors.tabs = getTabs;
  } else {
    selectors[name] = getItems;
  }

  if (moduleOptions.hasSearch) {
    selectors.searchResults = getSearchResults;
  }

  if (moduleOptions.hasMultipleSelection) {
    selectors.selectedNodesIds = getSelectedNodesIds;
    selectors.excludingMode = getExcludingMode;
  } else {
    selectors.selectedNodeId = getSelectedNodeId;
  }

  return createStructuredSelector(selectors);
};

const getURLParamsIfContext = (params, context) => {
  if (!context) {
    return null;
  }
  return params;
};

const getURLSources = createSelector(
  [getSources, getSelectedContext],
  getURLParamsIfContext
);
const getURLExporters = createSelector(
  [getExporters, getSelectedContext],
  getURLParamsIfContext
);
const getURLImporters = createSelector(
  [getImporters, getSelectedContext],
  getURLParamsIfContext
);
const getURLDestinations = createSelector(
  [getDestinations, getSelectedContext],
  getURLParamsIfContext
);

export const getNodesPanelUrlProps = createStructuredSelector({
  sources: getURLSources,
  exporters: getURLExporters,
  importers: getURLImporters,
  countries: getCountrySelectedNodeId,
  destinations: getURLDestinations,
  commodities: getCommoditySelectedNodeId
});
