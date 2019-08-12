import immer from 'immer';
import createReducer from 'utils/createReducer';
import fuzzySearch from 'utils/fuzzySearch';
import xor from 'lodash/xor';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import { DASHBOARD_STEPS } from 'constants';
import {
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID,
  DASHBOARD_ELEMENT__SET_SELECTED_COMMODITY_ID,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS,
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__CLEAR_PANELS,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_PAGE,
  DASHBOARD_ELEMENT__SET_LOADING_ITEMS,
  DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_SELECTED_YEARS,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_CHARTS,
  DASHBOARD_ELEMENT__EDIT_DASHBOARD,
  DASHBOARD_ELEMENT__SET_MISSING_DATA,
  DASHBOARD_ELEMENT__SET_LOADING
} from './dashboard-element.actions';
import initialState from './dashboard-element.initial-state';
import * as DashboardElementUrlPropHandlers from './dashboard-element.serializers';

const clearSubsequentPanels = (panel, state, item) => {
  const currentPanelIndex = DASHBOARD_STEPS[panel];
  const currentPanelMap = state.data[panel].reduce(
    (acc, next) => ({ ...acc, [next.id]: true }),
    {}
  );

  // if the selected items in a panel are zero, that means we're including all of them
  // thus the subsequent panels will include all possible nodes.
  // if we add an item at this point, it means we're passing from "show me all" to "show me just one" filtering
  // this means the subsequents panels selection most likely will be invalid and needs to be cleared.
  const hadAllItemsSelected = state.selectedNodesIds.filter(id => currentPanelMap[id]).length === 0;

  // if the selected items in a panel are N, that means that we're including only N
  // if we remove an item at this point, it means we're passing from "show me N" to "shot me N-1" filtering
  // this means the subsequent panels selection might include items that corresponded to the removed item
  // thus rendering the selection invalid so we need to clear it.
  // When passing from N to N+1 we're including more possible results so we don't need to clear the selection.
  const isRemovingAnItem = state.selectedNodesIds.find(i => i === item.id);

  if (hadAllItemsSelected || isRemovingAnItem) {
    const panelsToClear = Object.keys(DASHBOARD_STEPS).slice(currentPanelIndex + 1);
    const data = panelsToClear.flatMap(p => state.data[p]);
    const dataMap = data.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});
    return state.selectedNodesIds.filter(id => !dataMap[id]);
  }
  return state.selectedNodesIds;
};

const dashboardElementReducer = {
  dashboardElement(state, action) {
    const {
      data: {
        countries: countriesData,
        sources: sourcesData,
        commodities: commoditiesData,
        destinations: destinationsData,
        companies: companiesData
      },
      selectedNodesIds
    } = state;
    const isLoading =
      selectedNodesIds.length > 0 &&
      countriesData.length === 0 &&
      sourcesData.length === 0 &&
      commoditiesData.length === 0 &&
      destinationsData.length === 0 &&
      companiesData.length === 0;

    if (action.payload?.serializerParams) {
      const newState = deserialize({
        params: action.payload.serializerParams,
        state: initialState,
        urlPropHandlers: DashboardElementUrlPropHandlers,
        props: [
          'selectedYears',
          'selectedResizeBy',
          'selectedRecolorBy',
          'countries',
          'sources',
          'commodities',
          'destinations',
          'companies',
          'selectedNodesIds'
        ]
      });
      newState.loading = isLoading;
      return newState;
    }
    return { ...state, loading: isLoading };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_PANEL](state, action) {
    const { activePanelId } = action.payload;
    const prevActivePanelId = state.activePanelId;
    const prevPanelName = prevActivePanelId;
    const prevPanelState = prevActivePanelId
      ? {
          ...state[prevPanelName],
          page: initialState[prevPanelName].page
        }
      : undefined;
    return {
      ...state,
      activePanelId,
      ...(prevActivePanelId ? { [prevPanelName]: prevPanelState } : {}),
      searchResults: []
    };
  },
  [DASHBOARD_ELEMENT__EDIT_DASHBOARD](state) {
    return { ...state, editMode: true };
  },
  [DASHBOARD_ELEMENT__SET_PANEL_PAGE](state, action) {
    const { activePanelId } = state;
    const panelName = activePanelId;
    const { page } = action.payload;
    return { ...state, [panelName]: { ...state[panelName], page } };
  },
  [DASHBOARD_ELEMENT__SET_PANEL_DATA](state, action) {
    const { key, data } = action.payload;
    const initialData = initialState.data[key];
    const newData = data || initialData;
    return {
      ...state,
      data: { ...state.data, [key]: newData }
    };
  },
  [DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA](state, action) {
    const { key, data } = action.payload;

    if (data.length === 0) {
      return {
        ...state,
        [key]: {
          ...state[key],
          page: state[key].page - 1
        }
      };
    }

    const oldData = state.data[key];

    // in case we preloaded some items, we make sure to avoid duplicates
    const dataMap = data.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});

    const together = [...oldData.filter(item => !dataMap[item.id]), ...data];

    return {
      ...state,
      data: { ...state.data, [key]: together }
    };
  },
  [DASHBOARD_ELEMENT__SET_MISSING_DATA](state, action) {
    const { key, data } = action.payload;
    const oldData = state.data[key];
    const together = oldData ? [...oldData, ...data] : data;

    return {
      ...state,
      data: { ...state.data, [key]: together }
    };
  },
  [DASHBOARD_ELEMENT__SET_LOADING_ITEMS](state, action) {
    const { loadingItems } = action.payload;
    return {
      ...state,
      loadingItems
    };
  },
  [DASHBOARD_ELEMENT__SET_PANEL_TABS](state, action) {
    return immer(state, draft => {
      const { data, key } = action.payload;
      const getSection = n => n.section && n.section.toLowerCase();
      const panelTabs = data.filter(item => getSection(item) === key);
      draft.tabs = panelTabs.reduce(
        (acc, next) => ({ ...acc, [getSection(next)]: next.tabs }),
        state.tabs
      );
      draft[key].page = initialState[key].page;
    });
  },
  [DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID](state, action) {
    return immer(state, draft => {
      const { activeItem } = action.payload;

      draft.data.sources = initialState.data.sources;
      draft.sources = initialState.sources;
      draft.selectedCountryId =
        activeItem && activeItem.id !== state.selectedCountryId ? activeItem.id : null;
      draft.selectedNodesIds = [];
      draft.selectedCommodityId = null;
    });
  },
  [DASHBOARD_ELEMENT__SET_SELECTED_COMMODITY_ID](state, action) {
    return immer(state, draft => {
      const { activeItem } = action.payload;
      draft.selectedCommodityId =
        activeItem && activeItem.id !== state.selectedCountryId ? activeItem.id : null;

      const sourcesDataMap = state.data.sources.reduce(
        (acc, next) => ({ ...acc, [next.id]: true }),
        {}
      );
      // we filter selected nodes of panels after soy.
      draft.selectedNodesIds = state.selectedNodesIds.filter(id => sourcesDataMap[id]);
    });
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS](state, action) {
    return immer(state, draft => {
      const { panel, activeItem } = action.payload;

      const activeTab = state.tabs[panel]
        ? state.tabs[panel].find(tab => tab.name === activeItem.nodeType).id
        : null;

      if (panel === 'sources') {
        draft.sourcesActiveTab = activeTab;
      }
      if (panel === 'companies') {
        draft.companiesActiveTab = activeTab;
      }

      draft.selectedNodesIds = xor(clearSubsequentPanels(panel, state, activeItem), [
        activeItem.id
      ]);

      const data = state.data[panel] || [];
      const itemsWithSameNodeType = data.reduce(
        (acc, next) => ({ ...acc, [next.id]: next.nodeType === activeItem.nodeType }),
        {}
      );

      // we remove all items that belong to the same panel but dont match in node type
      draft.selectedNodesIds = draft.selectedNodesIds.filter(
        id => typeof itemsWithSameNodeType[id] === 'undefined' || itemsWithSameNodeType[id]
      );
    });
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_TAB](state, action) {
    return immer(state, draft => {
      const { panel, activeTab } = action.payload;
      const dataMap =
        draft.data[panel] || [].reduce((acc, next) => ({ ...next, [next.id]: true }), {});

      if (panel === 'sources') {
        draft.sourcesActiveTab = activeTab;
      }
      if (panel === 'companies') {
        draft.companiesActiveTab = activeTab;
      }
      draft[panel].page = initialState[panel].page;
      draft.selectedNodesIds = draft.selectedNodesIds.filter(nodeId => !dataMap[nodeId]);
    });
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH](state, action) {
    return immer(state, draft => {
      const { panel, activeItem } = action.payload;

      const activeTabObj =
        state.tabs[panel] && state.tabs[panel].find(tab => tab.id === activeItem.nodeTypeId);
      const activeTab = activeTabObj?.id || null;

      const data = state.data[panel] || [];
      const dataMap = data.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});
      let together = data;
      if (!dataMap[activeItem.id]) {
        together = [activeItem, ...data];
      }

      draft.data[panel] = together;

      if (panel === 'sources') {
        draft.sourcesActiveTab = activeTab;
      }
      if (panel === 'companies') {
        draft.companiesActiveTab = activeTab;
      }
      draft[panel].page = initialState[panel].page;
      draft.searchResults = [];
      draft.selectedNodesIds = xor(clearSubsequentPanels(panel, state, activeItem), [
        activeItem.id
      ]);

      const itemsWithSameNodeType = data.reduce(
        (acc, next) => ({ ...acc, [next.id]: next.nodeType === activeItem.nodeType }),
        {}
      );

      // we remove all items that belong to the same panel but dont match in node type
      draft.selectedNodesIds = draft.selectedNodesIds.filter(
        id => typeof itemsWithSameNodeType[id] === 'undefined' || itemsWithSameNodeType[id]
      );
    });
  },
  [DASHBOARD_ELEMENT__CLEAR_PANEL](state, action) {
    return immer(state, draft => {
      const { panel } = action.payload;

      if (panel === 'countries' || panel === 'sources') {
        draft.selectedCountryId = null;
        draft.selectedCommodityId = null;
      }

      if (panel === 'commodities') {
        draft.selectedCommodityId = null;
      }

      if (panel === 'countries' || panel === 'commodities' || panel === 'sources') {
        draft.selectedNodesIds = [];
      }

      if (panel !== 'destinations' && panel !== 'companies') {
        const dataMap = draft.data[panel].reduce((acc, next) => ({ ...acc, [next.id]: true }), {});
        draft.selectedNodesIds = state.selectedNodesIds.filter(id => !dataMap[id]);
      }
    });
  },
  [DASHBOARD_ELEMENT__CLEAR_PANELS](state) {
    return immer(state, () => {});
  },
  [DASHBOARD_ELEMENT__SET_SEARCH_RESULTS](state, action) {
    const { data, query } = action.payload;
    return {
      ...state,
      searchResults: fuzzySearch(query, data)
    };
  },
  [DASHBOARD_ELEMENT__SET_SELECTED_YEARS](state, action) {
    const { years } = action.payload;
    return {
      ...state,
      selectedYears: years
    };
  },
  [DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY](state, action) {
    const { indicator } = action.payload;
    return {
      ...state,
      selectedResizeBy: indicator.attributeId
    };
  },
  [DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY](state, action) {
    const { indicator } = action.payload;
    return {
      ...state,
      selectedRecolorBy: indicator.attributeId
    };
  },
  [DASHBOARD_ELEMENT__SET_CHARTS](state, action) {
    const { charts } = action.payload;
    // FIXME: this is a temporary hotfix, should be disabled on the backend side
    const IS_NOT_LOGISTIC_HUB_CHART = chart => !chart.url.includes('node_type_id=4');
    return {
      ...state,
      charts: {
        ...charts,
        data: charts.data.filter(IS_NOT_LOGISTIC_HUB_CHART)
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_LOADING](state, action) {
    const { loading } = action.payload;
    return { ...state, loading };
  }
};

const dashboardElementReducerTypes = PropTypes => {
  const PanelTypes = {
    page: PropTypes.number
  };

  return {
    tabs: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    loadingItems: PropTypes.bool,
    searchResults: PropTypes.array,
    activePanelId: PropTypes.string,
    data: PropTypes.shape({
      countries: PropTypes.array.isRequired,
      companies: PropTypes.object.isRequired,
      sources: PropTypes.object.isRequired,
      destinations: PropTypes.array.isRequired
    }).isRequired,
    countries: PropTypes.shape(PanelTypes).isRequired,
    sources: PropTypes.shape(PanelTypes).isRequired,
    destinations: PropTypes.shape(PanelTypes).isRequired,
    companies: PropTypes.shape(PanelTypes).isRequired,
    commodities: PropTypes.shape(PanelTypes).isRequired,
    selectedNodesIds: PropTypes.array,
    selectedYears: PropTypes.arrayOf(PropTypes.number),
    selectedResizeBy: PropTypes.string,
    selectedRecolorBy: PropTypes.string
  };
};

export { initialState };
export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
