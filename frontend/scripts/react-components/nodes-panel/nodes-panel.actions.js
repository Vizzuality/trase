export function createNodesPanelActions(name) {
  const constants = {
    FETCH_DATA: `${name.toUpperCase()}_PANEL__FETCH_DATA`,
    SET_PANEL_PAGE: `${name.toUpperCase()}_PANEL__SET_PANEL_PAGE`,
    SET_DATA: `${name.toUpperCase()}_PANEL__SET_DATA`,
    SET_TABS: `${name.toUpperCase()}_PANEL__SET_TABS`,
    SET_MORE_DATA: `${name.toUpperCase()}_PANEL__SET_MORE_DATA`,
    SET_MISSING_DATA: `${name.toUpperCase()}_PANEL__SET_MISSING_DATA`,
    SET_LOADING_ITEMS: `${name.toUpperCase()}_PANEL__SET_LOADING_ITEMS`,
    SET_SELECTED_ID: `${name.toUpperCase()}_PANEL__SET_SELECTED_COMMODITY_ID`,
    SET_SELECTED_IDS: `${name.toUpperCase()}_PANEL__SET_SELECTED_COMMODITY_IDS`,
    SET_ACTIVE_TAB: `${name.toUpperCase()}_PANEL__SET_ACTIVE_TAB`,
    SET_ACTIVE_ITEMS_WITH_SEARCH: `${name.toUpperCase()}_PANEL__SET_ACTIVE_ITEMS_WITH_SEARCH`,
    SET_SEARCH_RESULTS: `${name.toUpperCase()}_PANEL__SET_SEARCH_RESULTS`,
    GET_SEARCH_RESULTS: `${name.toUpperCase()}_PANEL__GET_SEARCH_RESULTS`
  };

  const actionCreators = {
    fetchData: () => ({
      type: constants.FETCH_DATA
    }),
    setSelectedItem: activeItem => ({
      type: constants.SET_SELECTED_ID,
      payload: { activeItem }
    }),
    setSelectedItems: activeItem => ({
      type: constants.SET_SELECTED_IDS,
      payload: { activeItem }
    }),
    setSelectedTab: activeTab => ({
      type: constants.SET_ACTIVE_TAB,
      payload: { activeTab }
    }),
    setLoadingItems: loadingItems => ({
      type: constants.SET_LOADING_ITEMS,
      payload: { loadingItems }
    }),
    setMoreData: payload => ({
      type: constants.SET_MORE_DATA,
      payload
    }),
    setPage: page => ({
      type: constants.SET_PANEL_PAGE,
      payload: page
    }),
    setMissingItems: data => ({
      type: constants.SET_MISSING_DATA,
      payload: { data }
    }),
    getSearchResults: query => ({
      type: constants.GET_SEARCH_RESULTS,
      payload: { query }
    }),
    setSearchResult: activeItem => ({
      type: constants.SET_ACTIVE_ITEMS_WITH_SEARCH,
      payload: { activeItem }
    })
  };

  return {
    ...constants,
    ...actionCreators
  };
}
