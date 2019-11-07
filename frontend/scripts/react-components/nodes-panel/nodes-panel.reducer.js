import immer from 'immer';
import xor from 'lodash/xor';
import fuzzySearch from 'utils/fuzzySearch';
import { DASHBOARD_STEPS } from 'constants';
import createReducer from 'utils/createReducer';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import nodesPanelSerialization from 'react-components/nodes-panel/nodes-panel.serializers';
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
  NODES_PANEL__SET_INSTANCE_ID,
  NODES_PANEL__SET_NO_DATA,
  NODES_PANEL__SET_FETCH_KEY,
  NODES_PANEL__SET_EXCLUDING_MODE,
  NODES_PANEL__SET_ORDER_BY
} from './nodes-panel.actions';
import modules from './nodes-panel.modules';
import nodesPanelInitialState from './nodes-panel.initial-state';

const getPanelsToClear = (panel, state, item) => {
  const currentPanelIndex = DASHBOARD_STEPS[panel];

  // if the selected items in a panel are zero, that means we're including all of them
  // thus the subsequent panels will include all possible nodes.
  // if we add an item at this point, it means we're passing from "show me all" to "show me just one" filtering
  // this means the subsequents panels selection most likely will be invalid and needs to be cleared.
  const hadAllItemsSelected = state[panel].selectedNodesIds.length === 0;

  // if the selected items in a panel are N, that means that we're including only N
  // if we remove an item at this point, it means we're passing from "show me N" to "show me N-1" filtering
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

const clearPanelData = (draft, { name, state, activeItem }) => {
  // clear following panels if necessary
  const panelsToClear = getPanelsToClear(name, state, activeItem);
  if (panelsToClear) {
    panelsToClear.forEach(panelToClear => {
      if (modules[panelToClear].hasMultipleSelection) {
        draft[panelToClear].selectedNodesIds =
          nodesPanelInitialState[panelToClear].selectedNodesIds;
      } else {
        draft[panelToClear].selectedNodeId = nodesPanelInitialState[panelToClear].selectedNodeId;
      }
      draft[panelToClear].data = nodesPanelInitialState[panelToClear].data;
    });
  }
};

const nodesPanelReducer = {
  dashboardElement(state, action) {
    if (action.payload?.serializerParams) {
      return deserialize({
        params: action.payload.serializerParams,
        state: nodesPanelInitialState,
        ...nodesPanelSerialization
      });
    }
    return state;
  },
  [NODES_PANEL__SET_INSTANCE_ID](state) {
    return immer(state, draft => {
      Object.assign(draft, nodesPanelInitialState);
    });
  },
  [NODES_PANEL__SET_PANEL_PAGE](state, action) {
    const { name } = action.meta;
    return immer(state, draft => {
      draft[name].page = action.payload;
    });
  },
  [NODES_PANEL__SET_FETCH_KEY](state, action) {
    const { name } = action.meta;
    return immer(state, draft => {
      draft[name].fetchKey = action.payload || null;
    });
  },
  [NODES_PANEL__FETCH_DATA](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    return immer(state, draft => {
      if (moduleOptions.hasTabs) {
        draft[name].activeTab = nodesPanelInitialState[name].activeTab;
      }
      draft[name].fetchKey = action.payload || null;

      if (draft[name].fetchKey !== null && state[name].fetchKey !== 'preloaded') {
        if (moduleOptions.hasMultipleSelection) {
          draft[name].selectedNodesIds = nodesPanelInitialState[name].selectedNodesIds;
        } else {
          draft[name].selectedNodeId = nodesPanelInitialState[name].selectedNodeId;
        }
      }
    });
  },
  [NODES_PANEL__SET_DATA](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    return immer(state, draft => {
      const { data } = action.payload;
      if (data) {
        const newItems = data.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
        draft[name].data.byId = data ? data.map(node => node.id) : [];
        draft[name].data.nodes = newItems;
      } else {
        draft[name].page = nodesPanelInitialState[name].page;
        draft[name].data = nodesPanelInitialState[name].data;

        if (moduleOptions.hasSearch) {
          draft[name].searchResults = nodesPanelInitialState[name].searchResults;
        }
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
        new Set([...state[name].data.byId, ...data.map(node => node.id)].map(n => parseInt(n, 10)))
      );

      draft[name].data.nodes = { ...state[name].data.nodes, ...newItems };
    });
  },
  [NODES_PANEL__SET_MISSING_DATA](state, action) {
    return immer(state, draft => {
      const { data } = action.payload;
      Object.entries(modules)
        .filter(([name]) => !['countries', 'commodities'].includes(name))
        .forEach(([name, moduleOptions]) => {
          data
            .filter(item => {
              if (moduleOptions.hasMultipleSelection) {
                return draft[name].selectedNodesIds.includes(item.id);
              }
              return draft[name].selectedNodeId === item.id;
            })
            .forEach(item => {
              if (!draft[name].data.nodes) {
                draft[name].data.nodes = {};
              }

              if (moduleOptions.hasTabs && !draft[name].activeTab) {
                draft[name].activeTab = item.columnId;
              }

              draft[name].data.byId.push(item.id);
              draft[name].data.nodes[item.id] = item;
            });
        });
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
        draft[name].page = nodesPanelInitialState[name].page;

        if (moduleOptions.hasSearch) {
          draft[name].searchResults = nodesPanelInitialState[name].searchResults;
        }
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
  [NODES_PANEL__SET_NO_DATA](state, action) {
    const { name } = action.meta;
    const { hasNoData } = action.payload;
    return immer(state, draft => {
      draft[name].noData = hasNoData;
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
            draft[panel].data = nodesPanelInitialState[panel].data;
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
        clearPanelData(draft, { state, activeItem, name });
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
        draft[name].page = nodesPanelInitialState[name].page;
      });
    }
    return state;
  },
  [NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    if (moduleOptions.hasSearch) {
      return immer(state, draft => {
        const { activeItem } = action.payload;

        if (moduleOptions.hasTabs) {
          const activeTabObj =
            state[name].tabs && state[name].tabs.find(tab => tab.id === activeItem.nodeTypeId);
          const activeTab = activeTabObj?.id || null;

          if (activeTab !== state[name].activeTab && state[name].activeTab) {
            draft[name].page = nodesPanelInitialState[name].page;
          }
          draft[name].activeTab = activeTab;
        }

        const existsInData = state[name].data.nodes[activeItem.id];
        draft[name].data.nodes = { ...state[name].data.nodes, [activeItem.id]: activeItem };
        if (!existsInData) {
          draft[name].data.byId = [activeItem.id, ...state[name].data.byId];
        }

        draft[name].searchResults = [];

        clearPanelData(draft, { state, activeItem, name });

        if (moduleOptions.hasMultipleSelection) {
          const firstItem =
            state[name].selectedNodesIds[0] &&
            state[name].data.nodes[state[name].selectedNodesIds[0]];
          if (firstItem && firstItem.nodeType !== activeItem.nodeType) {
            draft[name].selectedNodesIds = [activeItem.id];
          } else {
            draft[name].selectedNodesIds = xor(draft[name].selectedNodesIds, [activeItem.id]);
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
  },
  [NODES_PANEL__SET_EXCLUDING_MODE](state, action) {
    const { name } = action.meta;
    const { mode } = action.payload;
    const moduleOptions = modules[name];
    if (moduleOptions.hasMultipleSelection) {
      return immer(state, draft => {
        draft[name].selectedNodesIds = [];
        draft[name].excludingMode = mode;
        const panelIndex = DASHBOARD_STEPS[name];
        Object.entries(DASHBOARD_STEPS).forEach(([currentPanel, step]) => {
          const currentModuleOptions = modules[name];
          if (panelIndex < step) {
            if (currentModuleOptions.hasMultipleSelection) {
              draft[currentPanel].selectedNodesIds = [];
            } else {
              draft[currentPanel].selectedNodeId = null;
            }
          }
        });
      });
    }
    return state;
  },
  [NODES_PANEL__SET_ORDER_BY](state, action) {
    const { name } = action.meta;
    const { orderBy } = action.payload;
    return immer(state, draft => {
      draft[name].orderBy = orderBy.value;
      draft[name].data.byId = nodesPanelInitialState[name].data.byId;
      draft[name].page = nodesPanelInitialState[name].page;
    });
  }
};

const nodesPanelReducerTypes = PropTypes => ({
  data: PropTypes.shape({
    byId: PropTypes.array.isRequired,
    nodes: PropTypes.object
  }),
  page: PropTypes.number,
  loadingItems: PropTypes.bool,
  searchResults: PropTypes.array,
  selectedCommodityId: PropTypes.number
});

export default createReducer(nodesPanelInitialState, nodesPanelReducer, nodesPanelReducerTypes);
