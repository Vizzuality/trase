import { TOGGLE_MAP_LAYERS_MENU, SET_CONTEXT } from 'actions/app.actions';
import {
  SELECT_CONTEXTUAL_LAYERS,
  SELECT_YEARS,
  CHANGE_LAYOUT,
  SELECT_BASEMAP
} from 'react-components/tool/tool.actions';
import {
  TOOL_LINKS__SELECT_VIEW,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__SET_SELECTED_RESIZE_BY,
  TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
  TOOL_LINKS__SET_SELECTED_BIOME_FILTER,
  TOOL_LINKS__CHANGE_EXTRA_COLUMN,
  TOOL_LINKS__SWITCH_TOOL
} from 'react-components/tool-links/tool-links.actions';

export default [
  {
    type: SET_CONTEXT,
    category: 'Sankey',
    action: 'Switch context',
    getPayload: (action, state) => {
      const actionContext = state.app.contexts.find(context => context.id === action.payload);
      return `${actionContext.countryName} ${actionContext.commodityName}`;
    }
  },
  {
    type: TOOL_LINKS__SET_SELECTED_NODES,
    category: 'Sankey',
    action: 'Update node selection',
    getPayload: (action, state) => {
      const nodeNames = [];

      action.payload.nodeIds.forEach(d => {
        const node = state.toolLinks.data.nodes[d];
        if (typeof node !== 'undefined') {
          nodeNames.push(node.name);
        }
      });

      return nodeNames.join(',');
    }
  },
  {
    type: TOOL_LINKS__SET_SELECTED_BIOME_FILTER,
    category: 'Sankey',
    action: 'Update biome filter',
    getPayload: action => action.payload.name
  },
  {
    type: TOOL_LINKS__CHANGE_EXTRA_COLUMN,
    category: 'Sankey',
    action: 'Select extra column',
    getPayload: (action, state) => {
      const columnId = action.payload.columnId;
      if (!columnId) return 'CLEARED';
      const column = state.toolLinks.data.columns[columnId];
      return column?.name;
    }
  },
  {
    type: SELECT_YEARS,
    action: 'Select years',
    category: 'Sankey',
    getPayload: action => action.payload.years.join(',')
  },
  {
    type: TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
    action: 'Select recolor by',
    category: 'Sankey',
    getPayload: action => action.payload.name
  },
  {
    type: TOOL_LINKS__SET_SELECTED_RESIZE_BY,
    action: 'Select resize by',
    category: 'Sankey',
    getPayload: action => action.payload.name
  },
  {
    type: TOOL_LINKS__SELECT_VIEW,
    action: 'Select view',
    category: 'Sankey',
    getPayload: action => (action.payload.detailedView ? 'detailed' : 'overview')
  },
  {
    type: TOOL_LINKS__SELECT_COLUMN,
    category: 'Sankey',
    action: 'Select column',
    getPayload: (action, state) => state.toolLinks.data.columns[action.payload.columnId].name
  },
  {
    type: CHANGE_LAYOUT,
    action: 'Change layout',
    category: 'Sankey',
    getPayload: action => action.payload.toolLayout
  },
  {
    type: SELECT_BASEMAP,
    action: 'Select basemap',
    category: 'Sankey',
    getPayload: action => action.payload.selectedBasemap
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
    getPayload: action => action.payload.contextualLayers.join(', ')
  },
  {
    type: TOOL_LINKS__SWITCH_TOOL,
    action: 'Toggle tool',
    category: 'Sankey',
    getPayload: action => (action.payload.section ? 'data-view' : 'sankey')
  }
];
