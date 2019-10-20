import { combineReducers } from 'redux';
import createReducer from 'utils/createReducer';
import immer from 'immer';
import xor from 'lodash/xor';
import fuzzySearch from 'utils/fuzzySearch';

import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';

export const NODES_PANELS__SET_INSTANCE_ID = 'NODES_PANELS__SET_INSTANCE_ID';

function createNodesPanelReducer(name, moduleOptions = {}) {
  const {
    SET_PANEL_PAGE,
    SET_DATA,
    SET_MORE_DATA,
    SET_MISSING_DATA,
    SET_LOADING_ITEMS,
    SET_SELECTED_ID,
    SET_SELECTED_IDS,
    SET_ACTIVE_TAB,
    SET_TABS,
    SET_ACTIVE_ITEMS_WITH_SEARCH,
    SET_SEARCH_RESULTS
  } = createNodesPanelActions(name, moduleOptions);
  const initialState = {
    data: {
      byId: [],
      nodes: null
    },
    page: 1,
    loadingItems: false,
    searchResults: []
  };

  if (moduleOptions.hasMultipleSelection) {
    initialState.selectedNodesIds = [];
  } else {
    initialState.selectedNodeId = null;
  }

  if (moduleOptions.hasTabs) {
    initialState.tabs = [];
    initialState.activeTab = null;
  }

  const reducer = {
    [NODES_PANELS__SET_INSTANCE_ID](state) {
      return immer(state, draft => {
        Object.assign(draft, initialState);
      });
    },
    [SET_PANEL_PAGE](state, action) {
      return immer(state, draft => {
        draft.page = action.payload;
      });
    },
    [SET_DATA](state, action) {
      return immer(state, draft => {
        const { data } = action.payload;
        if (data) {
          const newItems = data.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
          draft.data.byId = data ? Object.keys(newItems) : [];
          draft.data.nodes = newItems;
        } else {
          draft.data = initialState.data;
        }
      });
    },
    [SET_MORE_DATA](state, action) {
      return immer(state, draft => {
        const { data } = action.payload;

        if (data.length === 0) {
          draft.page = state.page - 1;
          return;
        }

        const newItems = data.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
        // in case we preloaded some items, we make sure to avoid duplicates
        draft.data.byId = Array.from(new Set([...state.data.byId, ...Object.keys(newItems)]));
        draft.data.nodes = { ...state.data.nodes, ...newItems };
      });
    },
    [SET_MISSING_DATA](state, action) {
      return immer(state, draft => {
        const { data } = action.payload;
        const newItems = data.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
        draft.data.nodes = { ...state.data.nodes, ...newItems };
        draft.data.byId = Array.from(new Set([...state.data.byId, ...Object.keys(newItems)]));
      });
    },
    [SET_TABS](state, action) {
      if (moduleOptions.hasTabs) {
        return immer(state, draft => {
          const { data } = action.payload;
          const getSection = n => n.section && n.section.toLowerCase();
          const sectionTabs = data.find(item => getSection(item) === name);
          draft.tabs = sectionTabs?.tabs;
          draft.prefixes = {};
          draft.tabs.forEach(item => {
            draft.prefixes[item.name] = item.prefix;
          });
          draft.page = initialState.page;
        });
      }
      return state;
    },
    [SET_LOADING_ITEMS](state, action) {
      const { loadingItems } = action.payload;
      return immer(state, draft => {
        draft.loadingItems = loadingItems;
      });
    },
    [SET_SELECTED_ID](state, action) {
      if (!moduleOptions.hasMultiplSelection) {
        return immer(state, draft => {
          const { activeItem } = action.payload;
          draft.selectedNodeId =
            activeItem && activeItem.id !== state.selectedNodeId ? activeItem.id : null;
        });
      }
      return state;
    },
    [SET_SELECTED_IDS](state, action) {
      if (moduleOptions.hasMultipleSelection) {
        return immer(state, draft => {
          const { activeItem } = action.payload;

          if (moduleOptions.hasTabs) {
            draft.activeTab = state.tabs.find(tab => tab.name === activeItem.nodeType).id;

            // we clear the previously selected items if the new item has a different nodeType
            const firstItem =
              state.selectedNodesIds[0] && state.data.nodes[state.selectedNodesIds[0]];
            if (firstItem && firstItem.nodeType !== activeItem.nodeType) {
              draft.selectedNodesIds = [activeItem.id];
            } else {
              draft.selectedNodesIds = xor(draft.selectedNodesIds, [activeItem.id]);
            }
          } else {
            draft.selectedNodesIds = xor(draft.selectedNodesIds, [activeItem.id]);
          }
        });
      }
      return state;
    },
    [SET_ACTIVE_TAB](state, action) {
      if (moduleOptions.hasTabs) {
        return immer(state, draft => {
          const { activeTab } = action.payload;
          draft.activeTab = activeTab.id;
          draft.page = initialState.page;
        });
      }
      return state;
    },
    [SET_ACTIVE_ITEMS_WITH_SEARCH](state, action) {
      if (moduleOptions.hasSearch) {
        return immer(state, draft => {
          const { panel, activeItem } = action.payload;

          if (moduleOptions.hasTabs) {
            const activeTabObj =
              state.tabs[panel] && state.tabs[panel].find(tab => tab.id === activeItem.nodeTypeId);
            const activeTab = activeTabObj?.id || null;

            if (activeTab !== state.activeTab && state.activeTab) {
              draft.page = initialState.page;
            }
            draft.activeTab = activeTab;
          }

          const existsInData = state.data.nodes[activeItem.id];
          draft.data.nodes = { ...state.data.nodes, [activeItem.id]: activeItem };
          if (!existsInData) {
            draft.data.byId = [activeItem.id, ...state.data.byId];
          }

          draft.searchResults = [];

          if (moduleOptions.hasMultipleSelection) {
            const firstItem =
              state.selectedNodesIds[0] && state.data.nodes[state.selectedNodesIds[0]];
            if (firstItem && firstItem.nodeType !== activeItem.nodeType) {
              draft.selectedNodesIds = [activeItem.id];
            } else {
              draft.selectedNodesIds = xor(draft[panel], [activeItem.id]);
            }
          } else {
            draft.selectedNodeId = activeItem.id;
          }
        });
      }
      return state;
    },
    [SET_SEARCH_RESULTS](state, action) {
      if (moduleOptions.hasSearch) {
        return immer(state, draft => {
          const { data, query } = action.payload;
          draft.searchResults = fuzzySearch(query, data);
        });
      }
      return state;
    }
  };

  const reducerTypes = PropTypes => ({
    data: PropTypes.shape({
      byId: PropTypes.array.isRequired,
      nodes: PropTypes.object
    }).isRequired,
    page: PropTypes.number,
    loadingItems: PropTypes.bool.isRequired,
    searchResults: PropTypes.array.isRequired,
    selectedCommodityId: PropTypes.number
  });

  return createReducer(initialState, reducer, reducerTypes);
}

const nodesPanelReducer = combineReducers({
  instanceId: (state = null, action) =>
    action === NODES_PANELS__SET_INSTANCE_ID ? action.payload.instanceId : state,
  countries: createNodesPanelReducer('countries'),
  commodities: createNodesPanelReducer('commodities'),
  sources: createNodesPanelReducer('sources', {
    hasTabs: true,
    hasSearch: true,
    hasMultipleSelection: true
  }),
  destinations: createNodesPanelReducer('destinations', {
    hasSearch: true,
    hasMultipleSelection: true
  }),
  importers: createNodesPanelReducer('importers', { hasSearch: true, hasMultipleSelection: true }),
  exporters: createNodesPanelReducer('exporters', { hasSearch: true, hasMultipleSelection: true })
});

export default nodesPanelReducer;
