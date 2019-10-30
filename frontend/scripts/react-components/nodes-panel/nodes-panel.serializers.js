import { createPanelInitialState } from './nodes-panel.initial-state';

const makeNodePanelUrlPropHandlers = name => ({
  parse(param) {
    const initialState = createPanelInitialState(name);
    if (initialState.selectedNodesIds) {
      initialState.selectedNodesIds.push(...param);
    } else {
      initialState.selectedNodeId = param;
    }
    return initialState;
  }
});

export default {
  urlPropHandlers: {
    countries: makeNodePanelUrlPropHandlers('countries'),
    commodities: makeNodePanelUrlPropHandlers('commodities'),
    sources: makeNodePanelUrlPropHandlers('sources'),
    destinations: makeNodePanelUrlPropHandlers('destinations'),
    importers: makeNodePanelUrlPropHandlers('importers'),
    exporters: makeNodePanelUrlPropHandlers('exporters')
  },
  props: ['countries', 'sources', 'commodities', 'destinations', 'exporters', 'importers']
};
