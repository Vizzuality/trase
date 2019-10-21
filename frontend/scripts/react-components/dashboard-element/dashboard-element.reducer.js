import immer from 'immer';
import createReducer from 'utils/createReducer';
import fuzzySearch from 'utils/fuzzySearch';
import xor from 'lodash/xor';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import { DASHBOARD_STEPS } from 'constants';
import dashboardElementSerialization from 'react-components/dashboard-element/dashboard-element.serializers';
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

const getPanelsToClear = (panel, state, item) => {
  const currentPanelIndex = DASHBOARD_STEPS[panel];

  // if the selected items in a panel are zero, that means we're including all of them
  // thus the subsequent panels will include all possible nodes.
  // if we add an item at this point, it means we're passing from "show me all" to "show me just one" filtering
  // this means the subsequents panels selection most likely will be invalid and needs to be cleared.
  const hadAllItemsSelected = state[panel].length === 0;

  // if the selected items in a panel are N, that means that we're including only N
  // if we remove an item at this point, it means we're passing from "show me N" to "shot me N-1" filtering
  // this means the subsequent panels selection might include items that corresponded to the removed item
  // thus rendering the selection invalid so we need to clear it.
  // When passing from N to N+1 we're including more possible results so we don't need to clear the selection.
  const isRemovingAnItem = state[panel].includes(item.id);

  if (hadAllItemsSelected || isRemovingAnItem) {
    const panelsToClear = Object.keys(DASHBOARD_STEPS).slice(currentPanelIndex + 1);
    return panelsToClear;
  }
  return null;
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
      sources,
      companies,
      destinations
    } = state;
    const isLoading =
      (sources.length > 0 || companies.length > 0 || destinations.length > 0) &&
      countriesData.length === 0 &&
      sourcesData.length === 0 &&
      commoditiesData.length === 0 &&
      destinationsData.length === 0 &&
      companiesData.length === 0;

    if (action.payload?.serializerParams) {
      const newState = deserialize({
        params: action.payload.serializerParams,
        state: initialState,
        ...dashboardElementSerialization
      });
      newState.loading = isLoading;
      return newState;
    }
    return { ...state, loading: isLoading };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_PANEL](state, action) {
    return immer(state, draft => {
      const { activePanelId } = action.payload;
      const prevActivePanelId = state.activePanelId;
      if (prevActivePanelId) {
        draft.pages[prevActivePanelId] = initialState.pages[prevActivePanelId];
      }
      draft.activePanelId = activePanelId;
      draft.searchResults = [];
    });
  },
  [DASHBOARD_ELEMENT__EDIT_DASHBOARD](state) {
    return { ...state, editMode: true };
  },
  [DASHBOARD_ELEMENT__SET_PANEL_PAGE](state, action) {
    return immer(state, draft => {
      const { activePanelId } = state;
      const { page } = action.payload;
      draft.pages[activePanelId] = page;
    });
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
    return immer(state, draft => {
      const { key, data } = action.payload;

      if (data.length === 0) {
        draft.pages[key] = state.pages[key] - 1;
        return;
      }

      const oldData = state.data[key];

      // in case we preloaded some items, we make sure to avoid duplicates
      const dataMap = data.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});
      draft.data[key] = [...oldData.filter(item => !dataMap[item.id]), ...data];
    });
  },
  [DASHBOARD_ELEMENT__SET_MISSING_DATA](state, action) {
    return immer(state, draft => {
      const { data } = action.payload;
      const panelsByItem = {};
      state.sources.forEach(id => {
        panelsByItem[id] = 'sources';
      });
      state.companies.forEach(id => {
        panelsByItem[id] = 'companies';
      });
      state.destinations.forEach(id => {
        panelsByItem[id] = 'destinations';
      });
      data.forEach(item => {
        const panel = panelsByItem[item.id];
        draft.data[panel].push(item);
      });
    });
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
      draft.prefixes = {};
      data.forEach(item => {
        draft.prefixes[getSection(item)] = item.tabs.reduce(
          (acc, next) => ({ ...acc, [next.name]: next.prefix || null }),
          {}
        );
      });
      draft.pages[key] = initialState.pages[key];
    });
  },
  [DASHBOARD_ELEMENT__SET_SELECTED_COUNTRY_ID](state, action) {
    return immer(state, draft => {
      const { activeItem } = action.payload;

      draft.data.sources = initialState.data.sources;
      draft.sources = initialState.sources;
      draft.selectedCountryId =
        activeItem && activeItem.id !== state.selectedCountryId ? activeItem.id : null;
      draft.sources = [];
      draft.companies = [];
      draft.destinations = [];
      draft.sourcesActiveTab = null;
      draft.companiesActiveTab = null;
      draft.selectedCommodityId = null;
    });
  },
  [DASHBOARD_ELEMENT__SET_SELECTED_COMMODITY_ID](state, action) {
    return immer(state, draft => {
      const { activeItem } = action.payload;
      draft.selectedCommodityId =
        activeItem && activeItem.id !== state.selectedCountryId ? activeItem.id : null;

      draft.companies = [];
      draft.destinations = [];
      draft.companiesActiveTab = null;
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

      const panelsToClear = getPanelsToClear(panel, state, activeItem);

      if (panelsToClear) {
        panelsToClear.forEach(panelToClear => {
          draft[panelToClear] = [];
        });
      }

      // we clear the previously selected items if the new item has a different nodeType
      const firstItem =
        state[panel] && state[panel][0] && state.data[panel].find(i => i.id === state[panel][0]);
      if (firstItem && firstItem.nodeType !== activeItem.nodeType) {
        draft[panel] = [activeItem.id];
      } else {
        draft[panel] = xor(draft[panel], [activeItem.id]);
      }
    });
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_TAB](state, action) {
    return immer(state, draft => {
      const { panel, activeTab } = action.payload;

      if (panel === 'sources') {
        draft.sourcesActiveTab = activeTab;
      }
      if (panel === 'companies') {
        draft.companiesActiveTab = activeTab;
      }
      draft.pages[panel] = initialState.pages[panel];
    });
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH](state, action) {
    return immer(state, draft => {
      const { panel, activeItem } = action.payload;

      const activeTabObj =
        state.tabs[panel] && state.tabs[panel].find(tab => tab.id === activeItem.nodeTypeId);
      const activeTab = activeTabObj?.id || null;

      if (panel === 'sources') {
        if (activeTab !== state.sourcesActiveTab && state.sourcesActiveTab) {
          draft.pages[panel] = initialState.pages[panel];
        }
        draft.sourcesActiveTab = activeTab;
      }
      if (panel === 'companies') {
        if (activeTab !== state.companiesActiveTab && state.companiesActiveTab) {
          draft.pages[panel] = initialState.pages[panel];
        }
        draft.companiesActiveTab = activeTab;
      }

      const data = state.data[panel] || [];
      const existsInData = data.find(item => item.id === activeItem.id);
      let together = data;
      if (!existsInData) {
        together = [activeItem, ...data];
      }

      draft.data[panel] = together;
      draft.searchResults = [];

      const firstItem =
        state[panel] && state[panel][0] && state.data[panel].find(i => i.id === state[panel][0]);
      if (firstItem && firstItem.nodeType !== activeItem.nodeType) {
        draft[panel] = [activeItem.id];
      } else {
        draft[panel] = xor(draft[panel], [activeItem.id]);
      }
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
        draft.sources = [];
        draft.companies = [];
        draft.destinations = [];
      }

      if (panel === 'destinations') {
        draft.companies = [];
        draft.destinations = [];
      }

      if (panel === 'companies') {
        draft.companies = [];
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
    return {
      ...state,
      charts
    };
  },
  [DASHBOARD_ELEMENT__SET_LOADING](state, action) {
    const { loading } = action.payload;
    return { ...state, loading };
  }
};

const dashboardElementReducerTypes = PropTypes => ({
  data: PropTypes.shape({
    countries: PropTypes.array.isRequired,
    companies: PropTypes.array.isRequired,
    sources: PropTypes.array.isRequired,
    destinations: PropTypes.array.isRequired
  }).isRequired,
  pages: PropTypes.shape({
    countries: PropTypes.number.isRequired,
    sources: PropTypes.number.isRequired,
    commodities: PropTypes.number.isRequired,
    destinations: PropTypes.number.isRequired,
    companies: PropTypes.number.isRequired
  }),
  sources: PropTypes.array,
  companies: PropTypes.array,
  destinations: PropTypes.array,
  tabs: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingItems: PropTypes.bool.isRequired,
  searchResults: PropTypes.array.isRequired,
  activePanelId: PropTypes.string.isRequired,
  selectedYears: PropTypes.arrayOf(PropTypes.number),
  selectedResizeBy: PropTypes.number,
  selectedRecolorBy: PropTypes.number,
  selectedCountryId: PropTypes.number,
  selectedCommodityId: PropTypes.number,
  sourcesActiveTab: PropTypes.number,
  companiesActiveTab: PropTypes.number
});

export { initialState };
export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
