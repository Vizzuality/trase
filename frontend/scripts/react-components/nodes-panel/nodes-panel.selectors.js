import { createSelector, createStructuredSelector } from 'reselect';

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

  const selectors = {
    page: getPage,
    loading: getLoading
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
