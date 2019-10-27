import immer from 'immer';
import xor from 'lodash/xor';
import fuzzySearch from 'utils/fuzzySearch';
import { DASHBOARD_STEPS } from 'constants';
import createReducer from 'utils/createReducer';
import {
  NODES_PANEL__FETCH_DATA,
  NODES_PANEL__SET_PANEL_PAGE,
  NODES_PANEL__SET_DATA,
  NODES_PANEL__SET_MORE_DATA,
  NODES_PANEL__SET_MISSING_DATA,
  NODES_PANEL__SET_LOADING_ITEMS,
  NODES_PANEL__SET_SELECTED_ID,
  NODES_PANEL__SET_SELECTED_IDS,
  NODES_PANEL__SET_ACTIVE_TAB,
  NODES_PANEL__SET_TABS,
  NODES_PANEL__CLEAR_PANEL,
  NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH,
  NODES_PANEL__SET_SEARCH_RESULTS,
  NODES_PANEL__SET_INSTANCE_ID
} from './nodes-panel.actions';
import modules from './nodes-panel.modules';

const panelInitialState = name => {
  const moduleOptions = modules[name];
  const panelState = {
    data: {
      byId: [],
      nodes: null
    },
    page: 1,
    loadingItems: false,
    fetchKey: null
  };

  if (moduleOptions.hasMultipleSelection) {
    panelState.selectedNodesIds = [];
  } else {
    panelState.selectedNodeId = null;
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

const initialState = {
  instanceId: null,
  countries: panelInitialState('countries'),
  sources: panelInitialState('sources'),
  commodities: panelInitialState('commodities'),
  destinations: panelInitialState('destinations'),
  exporters: panelInitialState('exporters'),
  importers: panelInitialState('importers')
};

const resetState = (draft, name) => {
  const moduleOptions = modules[name];
  draft[name].page = initialState[name].page;
  draft[name].data = initialState[name].data;

  if (moduleOptions.hasSearch) {
    draft[name].searchResults = initialState[name].searchResults;
  }
};

const getPanelsToClear = (panel, state, item) => {
  const currentPanelIndex = DASHBOARD_STEPS[panel];

  // if the selected items in a panel are zero, that means we're including all of them
  // thus the subsequent panels will include all possible nodes.
  // if we add an item at this point, it means we're passing from "show me all" to "show me just one" filtering
  // this means the subsequents panels selection most likely will be invalid and needs to be cleared.
  const hadAllItemsSelected = state[panel].selectedNodesIds.length === 0;

  // if the selected items in a panel are N, that means that we're including only N
  // if we remove an item at this point, it means we're passing from "show me N" to "shot me N-1" filtering
  // this means the subsequent panels selection might include items that corresponded to the removed item
  // thus rendering the selection invalid so we need to clear it.
  // When passing from N to N+1 we're including more possible results so we don't need to clear the selection.
  const isRemovingAnItem = state[panel].selectedNodesIds.includes(item.id);

  if (hadAllItemsSelected || isRemovingAnItem) {
    const panelsToClear = Object.keys(DASHBOARD_STEPS)
      .filter(i => i !== panel)
      .slice(currentPanelIndex + 1);
    return panelsToClear;
  }
  return null;
};

const nodesPanelReducer = {
  [NODES_PANEL__SET_INSTANCE_ID](state) {
    return immer(state, draft => {
      Object.assign(draft, initialState);
    });
  },
  [NODES_PANEL__SET_PANEL_PAGE](state, action) {
    const { name } = action.meta;
    return immer(state, draft => {
      draft[name].page = action.payload;
    });
  },
  [NODES_PANEL__FETCH_DATA](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    return immer(state, draft => {
      if (moduleOptions.hasTabs) {
        draft[name].activeTab = initialState[name].activeTab;
      }
      draft[name].fetchKey = action.payload || null;

      if (draft[name].fetchKey !== null) {
        if (moduleOptions.hasMultipleSelection) {
          draft[name].selectedNodesIds = initialState[name].selectedNodesIds;
        } else {
          draft[name].selectedNodeId = initialState[name].selectedNodeId;
        }
      }
    });
  },
  [NODES_PANEL__SET_DATA](state, action) {
    const { name } = action.meta;
    return immer(state, draft => {
      const { data } = action.payload;
      if (data) {
        const newItems = data.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
        draft[name].data.byId = data ? Object.keys(newItems) : [];
        draft[name].data.nodes = newItems;
      } else {
        resetState(draft, name);
      }
    });
  },
  [NODES_PANEL__SET_MORE_DATA](state, action) {
    const { name } = action.meta;
    return immer(state, draft => {
      const { data } = action.payload;

      if (data.length === 0) {
        draft[name].page = state[name].page - 1;
        return;
      }

      const newItems = data.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
      // in case we preloaded some items, we make sure to avoid duplicates
      draft[name].data.byId = Array.from(
        new Set([...state[name].data.byId, ...Object.keys(newItems)])
      );
      draft[name].data.nodes = { ...state[name].data.nodes, ...newItems };
    });
  },
  [NODES_PANEL__SET_MISSING_DATA](state, action) {
    const { name } = action.meta;
    return immer(state, draft => {
      const { data } = action.payload;
      const newItems = data.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
      draft[name].data.nodes = { ...state[name].data.nodes, ...newItems };
      draft[name].data.byId = Array.from(
        new Set([...state[name].data.byId, ...Object.keys(newItems)])
      );
    });
  },
  [NODES_PANEL__SET_TABS](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    if (moduleOptions.hasTabs) {
      return immer(state, draft => {
        const { data } = action.payload;
        const getSection = n => n.section && n.section.toLowerCase();
        const sectionTabs = data.find(item => getSection(item) === name);
        draft[name].tabs = sectionTabs?.tabs;
        draft[name].prefixes = {};
        draft[name].tabs.forEach(item => {
          draft[name].prefixes[item.name] = item.prefix;
        });
        resetState(draft, name);
      });
    }
    return state;
  },
  [NODES_PANEL__SET_LOADING_ITEMS](state, action) {
    const { name } = action.meta;
    const { loadingItems } = action.payload;
    return immer(state, draft => {
      draft[name].loadingItems = loadingItems;
    });
  },
  [NODES_PANEL__SET_SELECTED_ID](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    const { activeItem } = action.payload;
    if (!moduleOptions.hasMultiplSelection) {
      return immer(state, draft => {
        draft[name].selectedNodeId =
          activeItem && activeItem.id !== state[name].selectedNodeId ? activeItem.id : null;

        // clear following panels
        const panelIndex = DASHBOARD_STEPS[name];
        Object.entries(DASHBOARD_STEPS).forEach(([panel, step]) => {
          const currentPanelOptions = modules[panel];
          if (panelIndex < step) {
            if (currentPanelOptions.hasMultipleSelection) {
              draft[panel].selectedNodesIds = [];
            } else {
              draft[panel].selectedNodeId = null;
            }
          }
        });
      });
    }
    return state;
  },
  [NODES_PANEL__SET_SELECTED_IDS](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    const { activeItem } = action.payload;
    if (moduleOptions.hasMultipleSelection) {
      return immer(state, draft => {
        if (moduleOptions.hasTabs) {
          draft[name].activeTab = state[name].tabs.find(tab => tab.name === activeItem.nodeType).id;

          // we clear the previously selected items if the new item has a different nodeType
          const firstItem =
            state[name].selectedNodesIds[0] &&
            state[name].data.nodes[state[name].selectedNodesIds[0]];
          if (firstItem && firstItem.nodeType !== activeItem.nodeType) {
            draft[name].selectedNodesIds = [activeItem.id];
          } else {
            draft[name].selectedNodesIds = xor(draft[name].selectedNodesIds, [activeItem.id]);
          }
        } else {
          draft[name].selectedNodesIds = xor(draft[name].selectedNodesIds, [activeItem.id]);
        }
        // clear following panels if necessary
        const panelsToClear = getPanelsToClear(name, state, activeItem);
        if (panelsToClear) {
          panelsToClear.forEach(panelToClear => {
            if (modules[panelToClear].hasMultipleSelection) {
              draft[panelToClear].selectedNodesIds = initialState[panelToClear].selectedNodesIds;
            } else {
              draft[panelToClear].selectedNodeId = initialState[panelToClear].selectedNodeId;
            }
          });
        }
      });
    }
    return state;
  },
  [NODES_PANEL__SET_ACTIVE_TAB](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    if (moduleOptions.hasTabs) {
      return immer(state, draft => {
        const { activeTab } = action.payload;
        draft[name].activeTab = activeTab.id;
        draft[name].page = initialState[name].page;
      });
    }
    return state;
  },
  [NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    if (moduleOptions.hasSearch) {
      return immer(state, draft => {
        const { panel, activeItem } = action.payload;

        if (moduleOptions.hasTabs) {
          const activeTabObj =
            state[name].tabs[panel] &&
            state[name].tabs[panel].find(tab => tab.id === activeItem.nodeTypeId);
          const activeTab = activeTabObj?.id || null;

          if (activeTab !== state[name].activeTab && state[name].activeTab) {
            draft[name].page = initialState[name].page;
          }
          draft[name].activeTab = activeTab;
        }

        const existsInData = state[name].data.nodes[activeItem.id];
        draft[name].data.nodes = { ...state[name].data.nodes, [activeItem.id]: activeItem };
        if (!existsInData) {
          draft[name].data.byId = [activeItem.id, ...state[name].data.byId];
        }

        draft[name].searchResults = [];

        if (moduleOptions.hasMultipleSelection) {
          const firstItem =
            state[name].selectedNodesIds[0] &&
            state[name].data.nodes[state[name].selectedNodesIds[0]];
          if (firstItem && firstItem.nodeType !== activeItem.nodeType) {
            draft[name].selectedNodesIds = [activeItem.id];
          } else {
            draft[name].selectedNodesIds = xor(draft[panel], [activeItem.id]);
          }
        } else {
          draft[name].selectedNodeId = activeItem.id;
        }
      });
    }
    return state;
  },
  [NODES_PANEL__SET_SEARCH_RESULTS](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    if (moduleOptions.hasSearch) {
      return immer(state, draft => {
        const { data, query } = action.payload;
        draft[name].searchResults = fuzzySearch(query, data);
      });
    }
    return state;
  },
  [NODES_PANEL__CLEAR_PANEL](state, action) {
    return immer(state, draft => {
      const { panel } = action.payload;
      const panelIndex = DASHBOARD_STEPS[panel];
      Object.entries(DASHBOARD_STEPS).forEach(([name, step]) => {
        const moduleOptions = modules[name];
        if (panelIndex <= step) {
          if (moduleOptions.hasMultipleSelection) {
            draft[name].selectedNodesIds = [];
          } else {
            draft[name].selectedNodeId = null;
          }
        }
      });
    });
  }
};

const nodesPanelReducerTypes = PropTypes => ({
  data: PropTypes.shape({
    byId: PropTypes.array.isRequired,
    nodes: PropTypes.object
  }).isRequired,
  page: PropTypes.number,
  loadingItems: PropTypes.bool.isRequired,
  searchResults: PropTypes.array.isRequired,
  selectedCommodityId: PropTypes.number
});

export default createReducer(initialState, nodesPanelReducer, nodesPanelReducerTypes);
