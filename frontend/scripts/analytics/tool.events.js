import { TOGGLE_MAP_LAYERS_MENU } from 'actions/app.actions';
import {
  SELECT_BIOME_FILTER,
  SELECT_COLUMN,
  SELECT_CONTEXTUAL_LAYERS,
  SELECT_RECOLOR_BY,
  SELECT_RESIZE_BY,
  SELECT_VIEW,
  SELECT_YEARS,
  SET_CONTEXT,
  TOGGLE_MAP,
  UPDATE_NODE_SELECTION
} from 'actions/tool.actions';

export default [
  {
    type: SET_CONTEXT,
    category: 'Sankey',
    action: 'Switch context',
    getPayload: (action, state) => {
      const actionContext = state.tool.contexts.find(context => context.id === action.payload);
      return `${actionContext.countryName} ${actionContext.commodityName}`;
    }
  },
  {
    type: UPDATE_NODE_SELECTION,
    category: 'Sankey',
    action: 'Update node selection',
    getPayload: action => action.data.map(d => d.name).join(',')
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
    getPayload: action => action.value
  },
  {
    type: SELECT_RESIZE_BY,
    action: 'Select resize by',
    category: 'Sankey',
    getPayload: action => action.resizeBy
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
    getPayload: (action, state) => state.tool.columns.find(col => col.id === action.columnId).name
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
