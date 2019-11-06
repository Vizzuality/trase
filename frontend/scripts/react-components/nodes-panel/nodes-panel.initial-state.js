import modules from 'react-components/nodes-panel/nodes-panel.modules';

export const createPanelInitialState = name => {
  const moduleOptions = modules[name];
  const panelState = {
    data: {
      byId: [],
      nodes: null
    },
    page: 1,
    noData: false,
    orderBy: 'volume',
    loadingItems: false,
    fetchKey: null
  };

  if (moduleOptions.hasMultipleSelection) {
    panelState.selectedNodesIds = [];
    panelState.excludingMode = false;
    panelState.draftSelectedNodesIds = [];
  } else {
    panelState.selectedNodeId = null;
    panelState.draftSelectedNodeId = null;
  }

  if (moduleOptions.hasTabs) {
    panelState.tabs = [];
    panelState.activeTab = null;
  }

  if (moduleOptions.hasSearch) {
    panelState.searchResults = [];
  }
  return panelState;
};

export default {
  countries: createPanelInitialState('countries'),
  sources: createPanelInitialState('sources'),
  commodities: createPanelInitialState('commodities'),
  destinations: createPanelInitialState('destinations'),
  exporters: createPanelInitialState('exporters'),
  importers: createPanelInitialState('importers')
};
