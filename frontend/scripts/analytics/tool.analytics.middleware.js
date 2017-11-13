import actions from 'actions';
import isFunction from 'lodash/isFunction';

export const GA_ACTION_WHITELIST = [
  {
    type: actions.SET_CONTEXT,
    category: 'Sankey',
    action: 'Switch context',
    getPayload: (action, state) => {
      const context = state.tool.contexts.find(context => context.id === action.payload);
      return context.countryName + ' ' + context.commodityName;
    }
  },
  {
    type: actions.UPDATE_NODE_SELECTION,
    category: 'Sankey',
    action: 'Update node selection',
    getPayload: action => action.data.map(d => d.name).join(',')
  },
  {
    type: actions.SELECT_BIOME_FILTER,
    category: 'Sankey',
    action: 'Update biome filter',
    getPayload: action => action.biomeFilter
  },
  {
    type: actions.SELECT_YEARS,
    action: 'Select years',
    category: 'Sankey',
    getPayload: action => action.years.join(',')
  },
  {
    type: actions.SELECT_RECOLOR_BY,
    action: 'Select recolor by',
    category: 'Sankey',
    getPayload: action => action.value
  },
  {
    type: actions.SELECT_RESIZE_BY,
    action: 'Select resize by',
    category: 'Sankey',
    getPayload: action => action.resizeBy
  },
  {
    type: actions.SELECT_VIEW,
    action: 'Select view',
    category: 'Sankey',
    getPayload: action => (action.detailedView) ? 'detailed' : 'overview'
  },
  {
    type: actions.SELECT_COLUMN,
    category: 'Sankey',
    action: 'Select column',
    getPayload: (action, state) => {
      return state.tool.columns.find(col => col.id === action.columnId).name;
    }
  },
  {
    type: actions.TOGGLE_MAP,
    action: 'Toggle map',
    category: 'Sankey'
  },
  {
    type: actions.TOGGLE_MAP_LAYERS_MENU,
    action: 'Toggle map layers menu',
    category: 'Sankey'
  },
  {
    type: actions.SELECT_CONTEXTUAL_LAYERS,
    action: 'Select contextual layers',
    category: 'Sankey',
    getPayload: action => action.contextualLayers.join(', ')
  }
];

const googleAnalyticsMiddleware = store => next => (action) => {
  if (typeof ga !== 'undefined') {
    const state = store.getState();
    const gaAction = GA_ACTION_WHITELIST.find(whitelistAction => action.type === whitelistAction.type);
    if (gaAction) {
      const gaEvent = {
        hitType: 'event',
        eventCategory: gaAction.category
      };
      if (isFunction(gaAction.action)) {
        gaEvent.eventAction = gaAction.action(action, state);
      } else {
        gaEvent.eventAction = gaAction.action;
      }
      if (gaAction.getPayload) {
        gaEvent.eventLabel = gaAction.getPayload(action, state);
      }
      window.ga('send', gaEvent);
    }
  }

  return next(action);
};

export { googleAnalyticsMiddleware as default };
