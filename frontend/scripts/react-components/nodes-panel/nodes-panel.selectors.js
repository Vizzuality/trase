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

export const getExpandedNodesIds = createSelector(
  [
    getSourcesSelectedNodesIds,
    getDestinationsSelectedNodesIds,
    getExportersSelectedNodesIds,
    getImportersSelectedNodesIds
  ],
  (...selectedNodesIdsByRole) => selectedNodesIdsByRole.flat()
);

const buildDirtyBlocks = (
  selectedCountryId,
  selectedCommodityId,
  sourcesActiveItems,
  destinationsActiveItems,
  exportersActiveItems,
  importersActiveItems
) => ({
  countries: selectedCountryId !== null,
  sources: sourcesActiveItems.length > 0,
  commodities: selectedCommodityId !== null,
  destinations: destinationsActiveItems.length > 0,
  exporters: exportersActiveItems.length > 0,
  importers: importersActiveItems.length > 0
});

export const getDirtyBlocks = createSelector(
  [
    getCountrySelectedNodeId,
    getCommoditySelectedNodeId,
    getSourcesSelectedNodesIds,
    getDestinationsSelectedNodesIds,
    getExportersSelectedNodesIds,
    getImportersSelectedNodesIds
  ],
  buildDirtyBlocks
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
  buildDirtyBlocks
);

const buildPreviousStepsString = name => (...steps) => {
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
};

const makeGetDraftPreviousSteps = name =>
  createSelector(
    [
      getCountryDraftSelectedNodeId,
      getSourcesDraftSelectedNodesIds,
      getCommodityDraftSelectedNodeId,
      getDestinationsDraftSelectedNodesIds,
      getExportersDraftSelectedNodesIds,
      getImportersDraftSelectedNodesIds
    ],
    buildPreviousStepsString(name)
  );

export const getSourcesDraftPreviousSteps = makeGetDraftPreviousSteps('sources');
export const getCommoditiesDraftPreviousSteps = makeGetDraftPreviousSteps('commodities');
export const getDestinationsDraftPreviousSteps = makeGetDraftPreviousSteps('destinations');
export const getExportersDraftPreviousSteps = makeGetDraftPreviousSteps('exporters');
export const getImportersDraftPreviousSteps = makeGetDraftPreviousSteps('importers');

const getSomeBlocksNeedUpdate = createSelector(
  [
    getSourcesFetchKey,
    getCommodityFetchKey,
    getDestinationsFetchKey,
    getExportersFetchKey,
    getImportersFetchKey,
    getSourcesDraftPreviousSteps,
    getCommoditiesDraftPreviousSteps,
    getDestinationsDraftPreviousSteps,
    getExportersDraftPreviousSteps,
    getImportersDraftPreviousSteps
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
      sourcesFetchKey === null || sourcesFetchKey === sourcesPreviousSteps,
      commoditiesFetchKey === null || commoditiesFetchKey === commoditiesPreviousSteps,
      destinationsFetchKey === null || destinationsFetchKey === destinationsPreviousSteps,
      exportersFetchKey === null || exportersFetchKey === exportersPreviousSteps,
      importersFetchKey === null || importersFetchKey === importersPreviousSteps
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

  const getDraftPreviousSteps = makeGetDraftPreviousSteps(name);

  const selectors = {
    page: getPage,
    loading: getLoading,
    noData: getNoData,
    fetchKey: getFetchKey,
    orderBy: getSelectedOrderBy,
    draftPreviousSteps: getDraftPreviousSteps
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
