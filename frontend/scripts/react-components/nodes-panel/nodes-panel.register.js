import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';
import reducer from './nodes-panel.reducer';
import saga from './nodes-panel.saga';

reducerRegistry.register('nodesPanel', reducer);
sagaRegistry.register('nodesPanel', saga);

// not ideal because you have to change in two, but still better than changing across all app
export {
  NODES_PANEL__SET_SELECTED_ID,
  NODES_PANEL__SET_SELECTED_IDS,
  NODES_PANEL__CLEAR_PANEL,
  NODES_PANEL__FETCH_DATA,
  NODES_PANEL__SET_PANEL_PAGE,
  NODES_PANEL__SET_DATA,
  NODES_PANEL__SET_TABS,
  NODES_PANEL__SET_MORE_DATA,
  NODES_PANEL__SET_MISSING_DATA,
  NODES_PANEL__GET_MISSING_DATA,
  NODES_PANEL__SET_LOADING_ITEMS,
  NODES_PANEL__SET_ACTIVE_TAB,
  NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH,
  NODES_PANEL__SET_SEARCH_RESULTS,
  NODES_PANEL__GET_SEARCH_RESULTS,
  NODES_PANEL__SET_NO_DATA,
  NODES_PANEL__SET_EXCLUDING_MODE,
  NODES_PANEL__SET_ORDER_BY,
  NODES_PANEL__EDIT_PANELS,
  NODES_PANEL__SAVE,
  NODES_PANEL__CANCEL_PANELS_DRAFT,
  NODES_PANEL__SYNC_NODES_WITH_SANKEY,
  NODES_PANEL__FINISH_SELECTION,
  fetchData,
  setData,
  setMoreData,
  setTabs,
  setSearchResults,
  setSelectedItem,
  setSelectedItems,
  setSelectedTab,
  setLoadingItems,
  setPage,
  setMissingItems,
  getMissingItems,
  getSearchResults,
  setSearchResult,
  clearPanel,
  editPanels,
  savePanels,
  finishSelection,
  cancelPanelsDraft,
  setNoData,
  setExcludingMode,
  setOrderBy,
  syncNodesWithSankey
} from './nodes-panel.actions';
