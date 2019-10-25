import { createSelector, createStructuredSelector } from 'reselect';
import { DASHBOARD_STEPS } from 'constants';

export function createNodesPanelSelectors(name, moduleOptions = {}) {
  const getById = state => state.nodesPanel[name].data.byId;
  const getNodes = state => state.nodesPanel[name].data.nodes;
  const getPage = state => state.nodesPanel[name].page;
  const getLoading = state => state.nodesPanel[name].loadingItems;
  const getTabs = state => state.nodesPanel[name].tabs;
  const getTab = state => state.nodesPanel[name].activeTab;
  const getSelectedNodeId = state => state.nodesPanel[name].selectedNodeId;
  const getSelectedNodesIds = state => state.nodesPanel[name].selectedNodesIds;
  const getSearchResults = state => state.nodesPanel[name].searchResults;
  const getFetchKey = state => state.nodesPanel[name].fetchKey;

  const getCountriesSelectedNodesIds = state => [state.nodesPanel.countries.selectedNodeId];
  const getSourcesSelectedNodesIds = state => state.nodesPanel.sources.selectedNodesIds;
  const getCommoditiesSelectedNodeId = state => [state.nodesPanel.commodities.selectedNodeId];
  const getDestinationsSelectedNodesIds = state => state.nodesPanel.destinations.selectedNodesIds;
  const getExportersSelectedNodesIds = state => state.nodesPanel.exporters.selectedNodesIds;
  const getImportersSelectedNodesIds = state => state.nodesPanel.importers.selectedNodesIds;

  const getItems = createSelector(
    [getById, getNodes],
    (byId, nodes) => byId.map(id => nodes[id])
  );

  const getActiveTab = createSelector(
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

  const getItemsByTab = createSelector(
    [getItems, getTabs, getActiveTab],
    (data, tabs, activeTab) => {
      const tab = tabs.find(t => t.id === activeTab);
      if (tab) {
        return data.filter(item => item.nodeType === tab.name);
      }
      return [];
    }
  );

  const getPreviousSteps = createSelector(
    [
      getCountriesSelectedNodesIds,
      getSourcesSelectedNodesIds,
      getCommoditiesSelectedNodeId,
      getDestinationsSelectedNodesIds,
      getExportersSelectedNodesIds,
      getImportersSelectedNodesIds
    ],
    (...steps) => {
      const currentStep = DASHBOARD_STEPS[name];
      const previousStepsSelectedItems = steps.slice(0, currentStep);
      return previousStepsSelectedItems.flatMap(step => step.join('_')).join('_');
    }
  );

  const selectors = {
    page: getPage,
    loading: getLoading,
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
}
