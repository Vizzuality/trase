import { createSelector, createStructuredSelector } from 'reselect';
import { DASHBOARD_STEPS } from 'constants';
import modules from 'react-components/nodes-panel/nodes-panel.modules';

const getCountrySelectedNodeId = state => state.nodesPanel.countries.selectedNodeId;
const getSourcesSelectedNodesIds = state => state.nodesPanel.sources.selectedNodesIds;
const getCommoditySelectedNodeId = state => state.nodesPanel.commodities.selectedNodeId;
const getDestinationsSelectedNodesIds = state => state.nodesPanel.destinations.selectedNodesIds;
const getExportersSelectedNodesIds = state => state.nodesPanel.exporters.selectedNodesIds;
const getImportersSelectedNodesIds = state => state.nodesPanel.importers.selectedNodesIds;

const getSourcesFetchKey = state => state.nodesPanel.sources.fetchKey;
const getCommodityFetchKey = state => state.nodesPanel.commodities.fetchKey;
const getDestinationsFetchKey = state => state.nodesPanel.destinations.fetchKey;
const getExportersFetchKey = state => state.nodesPanel.exporters.fetchKey;
const getImportersFetchKey = state => state.nodesPanel.importers.fetchKey;

const makeGetTabs = name => state => state.nodesPanel[name].tabs;

export const getDirtyBlocks = createSelector(
  [
    getCountrySelectedNodeId,
    getCommoditySelectedNodeId,
    getSourcesSelectedNodesIds,
    getDestinationsSelectedNodesIds,
    getExportersSelectedNodesIds,
    getImportersSelectedNodesIds
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
      getCountrySelectedNodeId,
      getSourcesSelectedNodesIds,
      getCommoditySelectedNodeId,
      getDestinationsSelectedNodesIds,
      getExportersSelectedNodesIds,
      getImportersSelectedNodesIds
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
  [getDirtyBlocks, getSomeBlocksNeedUpdate],
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
  const getSelectedNodeId = state => state.nodesPanel[name].selectedNodeId;
  const getSelectedNodesIds = state => state.nodesPanel[name].selectedNodesIds;
  const getSearchResults = state => state.nodesPanel[name].searchResults;
  const getFetchKey = state => state.nodesPanel[name].fetchKey;

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

  const getPreviousSteps = makeGetPreviousSteps(name);

  const selectors = {
    page: getPage,
    loading: getLoading,
    noData: getNoData,
    fetchKey: getFetchKey,
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
  } else {
    selectors.selectedNodeId = getSelectedNodeId;
  }

  return createStructuredSelector(selectors);
};
