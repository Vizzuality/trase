export const NODES_PANEL__SET_INSTANCE_ID = 'NODES_PANEL__SET_INSTANCE_ID';
export const NODES_PANEL__SET_SELECTED_ID = 'NODES_PANEL__SET_SELECTED_ID';
export const NODES_PANEL__SET_SELECTED_IDS = 'NODES_PANEL__SET_SELECTED_IDS';
export const NODES_PANEL__CLEAR_PANEL = 'NODES_PANEL__CLEAR_PANEL';
export const NODES_PANEL__FETCH_DATA = 'NODES_PANEL__FETCH_DATA';
export const NODES_PANEL__SET_PANEL_PAGE = 'NODES_PANEL__SET_PANEL_PAGE';
export const NODES_PANEL__SET_DATA = 'NODES_PANEL__SET_DATA';
export const NODES_PANEL__SET_TABS = 'NODES_PANEL__SET_TABS';
export const NODES_PANEL__SET_MORE_DATA = 'NODES_PANEL__SET_MORE_DATA';
export const NODES_PANEL__SET_MISSING_DATA = 'NODES_PANEL__SET_MISSING_DATA';
export const NODES_PANEL__SET_LOADING_ITEMS = 'NODES_PANEL__SET_LOADING_ITEMS';
export const NODES_PANEL__SET_ACTIVE_TAB = 'NODES_PANEL__SET_ACTIVE_TAB';
export const NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH =
  'NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH';
export const NODES_PANEL__SET_SEARCH_RESULTS = 'NODES_PANEL__SET_SEARCH_RESULTS';
export const NODES_PANEL__GET_SEARCH_RESULTS = 'NODES_PANEL__GET_SEARCH_RESULTS';

export const fetchData = (key, name) => ({
  type: NODES_PANEL__FETCH_DATA,
  payload: key,
  meta: { name }
});

export const setData = (data, name) => ({
  type: NODES_PANEL__SET_DATA,
  payload: { data },
  meta: { name }
});

export const setMoreData = (data, name) => ({
  type: NODES_PANEL__SET_MORE_DATA,
  payload: { data },
  meta: { name }
});

export const setTabs = (data, name) => ({
  type: NODES_PANEL__SET_TABS,
  payload: { data },
  meta: { name }
});

export const setSearchResults = (query, data, name) => ({
  type: NODES_PANEL__SET_SEARCH_RESULTS,
  payload: { query, data },
  meta: { name }
});

export const setSelectedItem = (activeItem, name) => ({
  type: NODES_PANEL__SET_SELECTED_ID,
  payload: { activeItem },
  meta: { name }
});

export const setSelectedItems = (activeItem, name) => ({
  type: NODES_PANEL__SET_SELECTED_IDS,
  payload: { activeItem },
  meta: { name }
});

export const setSelectedTab = (activeTab, name) => ({
  type: NODES_PANEL__SET_ACTIVE_TAB,
  payload: { activeTab },
  meta: { name }
});

export const setLoadingItems = (loadingItems, name) => ({
  type: NODES_PANEL__SET_LOADING_ITEMS,
  payload: { loadingItems },
  meta: { name }
});

export const setPage = (page, name) => ({
  type: NODES_PANEL__SET_PANEL_PAGE,
  payload: page,
  meta: { name }
});

export const setMissingItems = (data, name) => ({
  type: NODES_PANEL__SET_MISSING_DATA,
  payload: { data },
  meta: { name }
});

export const getSearchResults = (query, name) => ({
  type: NODES_PANEL__GET_SEARCH_RESULTS,
  payload: { query },
  meta: { name }
});

export const setSearchResult = (activeItem, name) => ({
  type: NODES_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH,
  payload: { activeItem },
  meta: { name }
});

export const clearPanel = panel => ({
  type: NODES_PANEL__CLEAR_PANEL,
  payload: { panel }
});
