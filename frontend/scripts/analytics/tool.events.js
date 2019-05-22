import { TOGGLE_MAP_LAYERS_MENU, SET_CONTEXT } from 'actions/app.actions';
import {
  SELECT_BIOME_FILTER,
  SELECT_COLUMN,
  SELECT_CONTEXTUAL_LAYERS,
  SELECT_RECOLOR_BY,
  SELECT_RESIZE_BY,
  SELECT_VIEW,
  SELECT_YEARS,
  TOGGLE_MAP,
  UPDATE_NODE_SELECTION
} from 'actions/tool.actions';

export default [
  {
    type: SET_CONTEXT,
    category: 'Sankey',
    action: 'Switch context',
    getPayload: (action, state) => {
      const actionContext = state.app.contexts.find(context => context.id === action.payload.id);
      return `${actionContext.countryName} ${actionContext.commodityName}`;
    }
  },
  {
    type: UPDATE_NODE_SELECTION,
    category: 'Sankey',
    action: 'Update node selection',
    getPayload: (action, state) => {
      const nodeNames = [];

      action.ids.forEach(d => {
        const node = state.toolLinks.data.nodes[d];
        if (typeof node !== 'undefined') {
          nodeNames.push(node.name);
        }
      });

      return nodeNames.join(',');
    }
  },
  {
    type: SELECT_BIOME_FILTER,
    category: 'Sankey',
    action: 'Update biome filter',
    getPayload: action => action.biomeFilter
  },
  {
    type: SELECT_YEARS,
    action: 'Select years',
    category: 'Sankey',
    getPayload: action => action.years.join(',')
  },
  {
    type: SELECT_RECOLOR_BY,
    action: 'Select recolor by',
    category: 'Sankey',
    getPayload: action => action.payload.name
  },
  {
    type: SELECT_RESIZE_BY,
    action: 'Select resize by',
    category: 'Sankey',
    getPayload: action => action.payload.name
  },
  {
    type: SELECT_VIEW,
    action: 'Select view',
    category: 'Sankey',
    getPayload: action => (action.detailedView ? 'detailed' : 'overview')
  },
  {
    type: SELECT_COLUMN,
    category: 'Sankey',
    action: 'Select column',
    getPayload: (action, state) =>
      state.toolLinks.columns.find(col => col.id === action.columnId).name
  },
  {
    type: TOGGLE_MAP,
    action: 'Toggle map',
    category: 'Sankey'
  },
  {
    type: TOGGLE_MAP_LAYERS_MENU,
    action: 'Toggle map layers menu',
    category: 'Sankey'
  },
  {
    type: SELECT_CONTEXTUAL_LAYERS,
    action: 'Select contextual layers',
    category: 'Sankey',
    getPayload: action => action.contextualLayers.join(', ')
  }
];
