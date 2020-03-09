import modules from 'react-components/nodes-panel/nodes-panel.modules';
import { createPanelInitialState } from './nodes-panel.initial-state';

const multipleSelectionStringify = (prop, DONT_SERIALIZE) => {
  if (!prop || prop.selectedNodesIds.length === 0) {
    return DONT_SERIALIZE;
  }
  if (prop.excludingMode) {
    return `excluded_${prop.selectedNodesIds.join(',')}`;
  }
  return prop.selectedNodesIds.join(',');
};

const makeNodePanelUrlPropHandlers = name => {
  const moduleOptions = modules[name];
  return {
    stringify: moduleOptions.hasMultipleSelection ? multipleSelectionStringify : undefined,
    parse(param) {
      const initialState = createPanelInitialState(name);
      if (moduleOptions.hasMultipleSelection) {
        let excludingMode = false;
        let list = null;
        if (param.toString().startsWith('excluded')) {
          list = param.split('_')[1];
          excludingMode = true;
        } else {
          list = param.toString();
        }
        const selectedNodesIds = list.split(',').map(Number);
        initialState.selectedNodesIds.push(...selectedNodesIds);
        initialState.excludingMode = excludingMode;
      } else {
        initialState.selectedNodeId = param;
      }
      return initialState;
    }
  };
};

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
