import createReducer from 'utils/createReducer';
import fuzzySearch from 'utils/fuzzySearch';
import xor from 'lodash/xor';
import { deserialize } from 'react-components/shared/url-serializer/url-serializer.component';
import {
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
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
      countries: { activeItems: countriesItems },
      sources: { activeItems: sourcesItems, activeTab: sourcesTab },
      commodities: { activeItems: commoditiesItems },
      destinations: { activeItems: destinationsItems },
      companies: { activeItems: companiesItems, activeTab: companiesTab }
    } = state;
    const isLoading =
      (countriesItems.length > 0 && countriesData.length === 0) ||
      (sourcesItems.length > 0 &&
        (!sourcesData[sourcesTab] || sourcesData[sourcesTab].length === 0)) ||
      (commoditiesItems.length > 0 && commoditiesData.length === 0) ||
      (destinationsItems.length > 0 && destinationsData.length === 0) ||
      (companiesItems.length > 0 &&
        (!companiesData[companiesTab] || companiesData[companiesTab].length === 0));

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
          'companies'
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
      ...(prevActivePanelId ? { [prevPanelName]: prevPanelState } : {})
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
    const { key, data, tab } = action.payload;
    const initialData = initialState.data[key];
    let newData;
    if (Array.isArray(initialData)) {
      newData = data || initialData;
    } else {
      newData = tab ? { ...state.data[key], [tab]: data } : initialData;
    }
    return {
      ...state,
      data: { ...state.data, [key]: newData }
    };
  },
  [DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA](state, action) {
    const { key, data, tab } = action.payload;

    if (data.length === 0) {
      return {
        ...state,
        [key]: {
          ...state[key],
          page: state[key].page - 1
        }
      };
    }

    const oldData = tab ? state.data[key][tab] : state.data[key];

    // in case we preloaded some items, we make sure to avoid duplicates
    const dataMap = data.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});

    const together = [...oldData.filter(item => !dataMap[item.id]), ...data];
    const newData = tab ? { ...state.data[key], [tab]: together } : together;

    return {
      ...state,
      data: { ...state.data, [key]: newData }
    };
  },
  [DASHBOARD_ELEMENT__SET_MISSING_DATA](state, action) {
    const { key, data, tab } = action.payload;
    const oldData = tab ? state.data[key][tab] : state.data[key];
    const together = oldData ? [...oldData, ...data] : data;
    const newData = tab ? { ...state.data[key], [tab]: together } : together;

    return {
      ...state,
      data: { ...state.data, [key]: newData }
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
    const { data, key } = action.payload;
    const getSection = n => n.section && n.section.toLowerCase();
    const panelTabs = data.filter(item => getSection(item) === key);
    const tabs = panelTabs.reduce(
      (acc, next) => ({ ...acc, [getSection(next)]: next.tabs }),
      state.tabs
    );

    return {
      ...state,
      tabs,
      [key]: {
        ...state[key],
        page: initialState[key].page
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEM](state, action) {
    const { panel, activeItem } = action.payload;
    const sourcesPanelState = panel === 'countries' ? initialState.sources : state.sources;
    const sourcesData = panel === 'countries' ? initialState.data.sources : state.data.sources;
    const activeItems = activeItem ? [activeItem.id] : initialState[panel].activeItems;
    return {
      ...state,
      data: {
        ...state.data,
        sources: sourcesData
      },
      sources: sourcesPanelState,
      [panel]: {
        ...state[panel],
        activeItems
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS](state, action) {
    const { panel, activeItems } = action.payload;
    const selectedItems = Array.isArray(activeItems) ? activeItems : [activeItems];
    const items = selectedItems.map(i => i.id);
    const activeTab = state.tabs[panel]
      ? state.tabs[panel].find(tab => tab.name === selectedItems[0].nodeType).id
      : null;
    return {
      ...state,
      [panel]: {
        ...state[panel],
        activeTab,
        activeItems: xor(state[panel].activeItems, items)
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_TAB](state, action) {
    const { panel, activeTab } = action.payload;

    return {
      ...state,
      [panel]: {
        ...state[panel],
        activeTab,
        page: initialState[panel].page,
        activeItems: initialState[panel].activeItems
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH](state, action) {
    const { panel, activeItems: selectedItem } = action.payload;

    const activeTabObj =
      state.tabs[panel] && state.tabs[panel].find(tab => tab.id === selectedItem.nodeTypeId);
    const activeTab = activeTabObj?.id || null;

    const prevTab = state[panel].activeTab;
    const clearedActiveTabData = prevTab && prevTab !== activeTab ? { [prevTab]: null } : {};

    const activeItems =
      activeTab === prevTab ? xor(state[panel].activeItems, [selectedItem.id]) : [selectedItem.id];

    const oldData = (activeTab ? state.data[panel][activeTab] : state.data[panel]) || [];
    const dataMap = oldData.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});
    let together = oldData;
    if (!dataMap[selectedItem.id]) {
      together = [selectedItem, ...oldData];
    }
    const newData = activeTab
      ? {
          ...state.data[panel],
          ...clearedActiveTabData,
          [activeTab]: together
        }
      : together;

    return {
      ...state,
      data: {
        ...state.data,
        [panel]: newData
      },
      [panel]: {
        ...state[panel],
        activeItems,
        activeTab,
        searchResults: [],
        page: initialState[panel].page
      }
    };
  },
  [DASHBOARD_ELEMENT__CLEAR_PANEL](state, action) {
    const { panel } = action.payload;
    const { activeTab } = state[panel];
    const shouldResetCountries = ['countries', 'sources'].includes(panel);
    const countriesState = shouldResetCountries ? initialState.countries : state.countries;

    return {
      ...state,
      [panel]: { ...initialState[panel], activeTab },
      countries: countriesState
    };
  },
  [DASHBOARD_ELEMENT__CLEAR_PANELS](state, action) {
    const { panels } = action.payload;
    const removedPanels = {};
    panels.forEach(panel => {
      const { activeTab } = state[panel];
      removedPanels[panel] = { ...initialState[panel], activeTab };
    });
    return {
      ...state,
      ...removedPanels
    };
  },
  [DASHBOARD_ELEMENT__SET_SEARCH_RESULTS](state, action) {
    const { data, query } = action.payload;
    let panel = state.activePanelId;
    if (state.activePanelId === 'sources' && state.countries.activeItems.length === 0) {
      panel = 'countries';
    }
    return {
      ...state,
      [panel]: {
        ...state[panel],
        searchResults: fuzzySearch(query, data)
      }
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
    page: PropTypes.number,
    searchResults: PropTypes.array,
    activeItems: PropTypes.array,
    activeTab: PropTypes.number
  };

  return {
    tabs: PropTypes.object.isRequired,
    loading: PropTypes.bool,
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
    selectedYears: PropTypes.arrayOf(PropTypes.number),
    selectedResizeBy: PropTypes.string,
    selectedRecolorBy: PropTypes.string
  };
};

export { initialState };
export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
