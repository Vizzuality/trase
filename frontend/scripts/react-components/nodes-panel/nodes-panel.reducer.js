import immer from 'immer';
import xor from 'lodash/xor';
import fuzzySearch from 'utils/fuzzySearch';
import { DASHBOARD_STEPS } from 'constants';
import createReducer from 'utils/createReducer';
import pluralize from 'utils/pluralize';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import nodesPanelSerialization from 'react-components/nodes-panel/nodes-panel.serializers';

import { SET_CONTEXTS } from 'app/app.actions';
import {
  TOOL_LINKS__SET_COLUMNS,
  TOOL_LINKS__COLLAPSE_SANKEY,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS_RESET_SANKEY
} from 'react-components/tool-links/tool-links.actions';

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
  NODES_PANEL__SET_NO_DATA,
  NODES_PANEL__SET_ORDER_BY,
  NODES_PANEL__SET_EXCLUDING_MODE,
  NODES_PANEL__EDIT_PANELS,
  NODES_PANEL__SAVE,
  NODES_PANEL__CANCEL_PANELS_DRAFT,
  NODES_PANEL__SYNC_NODES_WITH_SANKEY
} from './nodes-panel.actions';
import modules from './nodes-panel.modules';
import nodesPanelInitialState from './nodes-panel.initial-state';

const getPanelsToClear = (panel, state, item, isANewTab) => {
  const currentPanelIndex = DASHBOARD_STEPS[panel];

  // if the selected items in a panel are zero, that means we're including all of them
  // thus the subsequent panels will include all possible nodes.
  // if we add an item at this point, it means we're passing from "show me all" to "show me just one" filtering
  // this means the subsequents panels selection most likely will be invalid and needs to be cleared.
  const hadAllItemsSelected = state[panel].draftSelectedNodesIds.length === 0;

  // if the selected items in a panel are N, that means that we're including only N
  // if we remove an item at this point, it means we're passing from "show me N" to "show me N-1" filtering
  // this means the subsequent panels selection might include items that corresponded to the removed item
  // thus rendering the selection invalid so we need to clear it.
  // When passing from N to N+1 we're including more possible results so we don't need to clear the selection.
  const isRemovingAnItem = state[panel].draftSelectedNodesIds.includes(item.id);

  if (hadAllItemsSelected || isRemovingAnItem || isANewTab) {
    const panelsToClear = Object.keys(DASHBOARD_STEPS)
      .filter(i => i !== panel)
      .slice(currentPanelIndex + 1);
    return panelsToClear;
  }
  return null;
};

const clearPanelData = (draft, { name, state, activeItem, isANewTab }) => {
  // clear following panels if necessary
  const panelsToClear = getPanelsToClear(name, state, activeItem, isANewTab);
  if (panelsToClear) {
    panelsToClear.forEach(panelToClear => {
      if (modules[panelToClear].hasMultipleSelection) {
        draft[panelToClear].draftSelectedNodesIds =
          nodesPanelInitialState[panelToClear].draftSelectedNodesIds;
      } else {
        draft[panelToClear].draftSelectedNodeId =
          nodesPanelInitialState[panelToClear].draftSelectedNodeId;
      }
      draft[panelToClear].data.byId = nodesPanelInitialState[panelToClear].data.byId;
      draft[panelToClear].noData = nodesPanelInitialState[panelToClear].noData;
      draft[panelToClear].excludingMode = nodesPanelInitialState[panelToClear].excludingMode;
      draft[panelToClear].fetchKey = nodesPanelInitialState[panelToClear].fetchKey;
    });
  }
};

const clearSelectedNodes = draft =>
  Object.keys(DASHBOARD_STEPS).forEach(name => {
    const moduleOptions = modules[name];
    if (!['welcome', 'countries', 'commodities'].includes(name)) {
      if (moduleOptions.hasMultipleSelection) {
        draft[name].selectedNodesIds = [];
      } else {
        draft[name].selectedNodeId = null;
      }
      draft[name].noData = nodesPanelInitialState[name].noData;
    }
  });

const deserializeInternalLink = (state, action) => {
  if (action.payload?.serializerParams) {
    const params = action.payload.serializerParams;
    const newState = deserialize({
      params,
      state: nodesPanelInitialState,
      ...nodesPanelSerialization
    });
    if (params && params.__temporaryExpandedNodes) {
      newState.__temporaryExpandedNodes = params.__temporaryExpandedNodes;
    }
    return newState;
  }
  return state;
};

const nodesPanelReducer = {
  dashboardElement(state, action) {
    return { ...deserializeInternalLink(state, action), instanceId: action.type };
  },
  tool(state, action) {
    return { ...deserializeInternalLink(state, action), instanceId: action.type };
  },
  [SET_CONTEXTS](state, action) {
    return immer(state, draft => {
      const contexts = action.payload;
      if (
        (state.countries.selectedNodeId === null || state.commodities.selectedNodeId === null) &&
        state.instanceId === 'tool'
      ) {
        const defaultContext = contexts.find(ctx => ctx.isDefault);
        draft.countries.selectedNodeId = defaultContext.countryId;
        draft.commodities.selectedNodeId = defaultContext.commodityId;
      }
    });
  },
  [TOOL_LINKS__SET_COLUMNS](state, action) {
    return immer(state, draft => {
      const { columns } = action.payload;
      if (state.__temporaryExpandedNodes.length > 0) {
        // this means we navigated internally with hopes of expanding some nodes once we had the columns
        state.__temporaryExpandedNodes.forEach(node => {
          const { id, nodeType } = node;
          // with the columns we fing the role
          const { role } = columns.find(col => col.name === nodeType);
          const name = pluralize(role);
          const moduleOptions = modules[name];
          // with the role we set up the state
          if (moduleOptions.hasMultipleSelection) {
            draft[name].selectedNodesIds.push(id);
          } else {
            draft[name].selectedNodeId = id;
          }
          if (!draft[name].data.nodes) {
            draft[name].data.nodes = {};
          }
          if (!draft[name].data.nodes[id]) {
            draft[name].data.nodes[id] = node;
          }
        });

        // finally we clear the temporary state.
        draft.__temporaryExpandedNodes = [];
      }
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
      draft[name].noData = nodesPanelInitialState[name].noData;
      if (moduleOptions.hasTabs) {
        draft[name].activeTab = nodesPanelInitialState[name].activeTab;
      }
    });
  },
  [NODES_PANEL__SET_DATA](state, action) {
    const { name } = action.meta;
    const moduleOptions = modules[name];
    return immer(state, draft => {
      const { data, fetchKey } = action.payload;
      if (data) {
        draft[name].fetchKey = fetchKey || nodesPanelInitialState[name].fetchKey;

        const newItems = data.reduce((acc, next) => ({ ...acc, [next.id]: next }), {});
        draft[name].data.byId = data ? data.map(node => node.id) : [];
        draft[name].data.nodes = { ...(state[name].data.nodes || {}), ...newItems };
      } else {
        draft[name].page = nodesPanelInitialState[name].page;
        draft[name].data.byId = nodesPanelInitialState[name].data.byId;

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
    if (!moduleOptions.hasMultipleSelection) {
      return immer(state, draft => {
        draft[name].draftSelectedNodeId =
          activeItem && activeItem.id !== state[name].draftSelectedNodeId ? activeItem.id : null;
        // clear following panels
        const panelIndex = DASHBOARD_STEPS[name];
        Object.entries(DASHBOARD_STEPS).forEach(([panel, step]) => {
          const currentPanelOptions = modules[panel];
          if (panelIndex <= step && panel !== name) {
            if (currentPanelOptions.hasMultipleSelection) {
              draft[panel].draftSelectedNodesIds = [];
            } else {
              draft[panel].draftSelectedNodeId = null;
            }
            draft[panel].data.byId = nodesPanelInitialState[panel].data.byId;
            draft[panel].noData = nodesPanelInitialState[panel].noData;
            draft[panel].excludingMode = nodesPanelInitialState[panel].excludingMode;
            draft[panel].fetchKey = nodesPanelInitialState[panel].fetchKey;
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
        let isANewTab = false;
        if (moduleOptions.hasTabs) {
          // we clear the previously selected items if the new item has a different nodeType
          const firstItem =
            state[name].draftSelectedNodesIds[0] &&
            state[name].data.nodes[state[name].draftSelectedNodesIds[0]];

          isANewTab =
            firstItem &&
            (firstItem.nodeType || firstItem.type) !== (activeItem.nodeType || activeItem.type);
          if (isANewTab) {
            draft[name].draftSelectedNodesIds = [activeItem.id];
          } else {
            draft[name].draftSelectedNodesIds = xor(draft[name].draftSelectedNodesIds, [
              activeItem.id
            ]);
          }
        } else {
          draft[name].draftSelectedNodesIds = xor(draft[name].draftSelectedNodesIds, [
            activeItem.id
          ]);
        }
        clearPanelData(draft, { state, activeItem, name, isANewTab });
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
        let isANewTab = false;

        if (moduleOptions.hasTabs) {
          const activeTabObj =
            state[name].tabs &&
            state[name].tabs.find(tab => tab.id === (activeItem.nodeType || activeItem.type));
          const activeTab = activeTabObj?.id || null;

          if (activeTab !== state[name].activeTab && state[name].activeTab) {
            draft[name].page = nodesPanelInitialState[name].page;
          }
          draft[name].activeTab = activeTab;
        }

        draft[name].data.nodes = { ...state[name].data.nodes, [activeItem.id]: activeItem };

        draft[name].searchResults = [];

        if (moduleOptions.hasMultipleSelection) {
          const firstItem =
            state[name].draftSelectedNodesIds[0] &&
            state[name].data.nodes[state[name].draftSelectedNodesIds[0]];
          isANewTab =
            firstItem &&
            (firstItem.nodeType || firstItem.type) !== (activeItem.nodeType || activeItem.type);
          if (isANewTab) {
            draft[name].draftSelectedNodesIds = [activeItem.id];
          } else {
            draft[name].draftSelectedNodesIds = xor(draft[name].draftSelectedNodesIds, [
              activeItem.id
            ]);
          }
        } else {
          draft[name].draftSelectedNodeId = activeItem.id;
        }

        clearPanelData(draft, { state, activeItem, name, isANewTab });
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
            draft[name].draftSelectedNodesIds = [];
          } else {
            draft[name].draftSelectedNodeId = null;
          }

          draft[name].noData = nodesPanelInitialState[name].noData;
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
        draft[name].draftSelectedNodesIds = [];
        draft[name].excludingMode = mode;
        const panelIndex = DASHBOARD_STEPS[name];
        Object.entries(DASHBOARD_STEPS).forEach(([currentPanel, step]) => {
          const currentModuleOptions = modules[name];
          if (panelIndex < step) {
            if (currentModuleOptions.hasMultipleSelection) {
              draft[currentPanel].draftSelectedNodesIds = [];
            } else {
              draft[currentPanel].draftSelectedNodeId = null;
            }
            draft[currentPanel].noData = nodesPanelInitialState[currentPanel].noData;
          }
        });
      });
    }
    return state;
  },
  [NODES_PANEL__SET_ORDER_BY](state, action) {
    const { name } = action.meta;
    const { orderBy } = action.payload;
    const moduleOptions = modules[name];
    return immer(state, draft => {
      draft[name].orderBy = orderBy.value;
      draft[name].data.byId = nodesPanelInitialState[name].data.byId;
      draft[name].page = nodesPanelInitialState[name].page;
      draft[name].noData = nodesPanelInitialState[name].noData;
      draft[name].fetchKey = nodesPanelInitialState[name].fetchKey;
      if (moduleOptions.hasMultipleSelection) {
        draft[name].selectedNodesIds = [];
      } else {
        draft[name].selectedNodeId = null;
      }
    });
  },
  [NODES_PANEL__EDIT_PANELS](state) {
    // Copies the panel selectedIds to draftSelectedIds on panel edit start
    return immer(state, draft => {
      Object.keys(state).forEach(name => {
        const moduleOptions = modules[name];
        if (moduleOptions) {
          const panelData = state[name];
          if (moduleOptions.hasMultipleSelection) {
            draft[name].draftSelectedNodesIds = panelData.selectedNodesIds;
          } else {
            draft[name].draftSelectedNodeId = panelData.selectedNodeId;
          }
        }
      });
    });
  },
  [NODES_PANEL__SAVE](state) {
    // Copies the panel selectedIds to draftSelectedIds on panel edit start
    return immer(state, draft => {
      Object.keys(state).forEach(name => {
        const moduleOptions = modules[name];
        if (moduleOptions) {
          const panelData = draft[name];
          if (moduleOptions.hasMultipleSelection) {
            draft[name].selectedNodesIds = panelData.draftSelectedNodesIds;
          } else {
            draft[name].selectedNodeId = panelData.draftSelectedNodeId;
          }

          if (moduleOptions.hasTabs) {
            draft[name].savedActiveTab = state[name].activeTab;
            draft[name].savedTabs = state[name].tabs;
          }
        }
      });
    });
  },
  [NODES_PANEL__CANCEL_PANELS_DRAFT](state) {
    // Deletes the draft
    return immer(state, draft => {
      Object.entries(modules).forEach(([name, moduleOptions]) => {
        if (moduleOptions.hasMultipleSelection) {
          if (
            state[name].draftSelectedNodesIds.length > 0 &&
            state[name].selectedNodesIds.length > 0 &&
            state[name].draftSelectedNodesIds !== state[name].selectedNodesIds
          ) {
            draft[name].fetchKey = nodesPanelInitialState[name].fetchKey;
          }
          draft[name].draftSelectedNodesIds = nodesPanelInitialState[name].draftSelectedNodesIds;
        } else {
          if (state[name].draftSelectedNodeId !== state[name].selectedNodeId) {
            draft[name].fetchKey = nodesPanelInitialState[name].fetchKey;
          }
          draft[name].draftSelectedNodeId = nodesPanelInitialState[name].draftSelectedNodeId;
        }
      });
    });
  },
  [NODES_PANEL__SYNC_NODES_WITH_SANKEY](state, action) {
    return immer(state, draft => {
      const { nodesByRole } = action.payload;
      clearSelectedNodes(draft);
      Object.entries(nodesByRole).forEach(([name, selectedNodes]) => {
        draft[name].selectedNodesIds = [];
        if (!draft[name].data.nodes) {
          draft[name].data.nodes = {};
        }
        selectedNodes.forEach(node => {
          draft[name].selectedNodesIds.push(node.id);
          if (!draft[name].data.nodes[node.id]) {
            draft[name].data.nodes[node.id] = node;
          }
        });
      });
    });
  },
  [TOOL_LINKS__COLLAPSE_SANKEY](state) {
    return immer(state, draft => {
      clearSelectedNodes(draft);
    });
  },
  [TOOL_LINKS__SELECT_COLUMN](state, action) {
    const { columnRole } = action.payload;
    return immer(state, draft => {
      const name = pluralize(columnRole);
      // groups with multiple columns always allow for multiple selection
      draft[name].selectedNodesIds = nodesPanelInitialState[name].selectedNodesIds;
      draft[name].excludingMode = nodesPanelInitialState[name].excludingMode;
    });
  },
  [TOOL_LINKS_RESET_SANKEY](state) {
    return immer(state, draft => clearSelectedNodes(draft));
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
