import camelCase from 'lodash/camelCase';
import createReducer from 'utils/createReducer';
import { getActiveTab } from 'react-components/dashboard-element/dashboard-element.selectors';
import {
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_ACTIVE_ID,
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR,
  DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_PANEL_TABS,
  DASHBOARD_ELEMENT__SET_PANEL_PAGE,
  DASHBOARD_ELEMENT__SET_LOADING_ITEMS,
  DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS
} from './dashboard-element.actions';

const initialState = {
  loading: false,
  data: {
    indicators: [],
    countries: [],
    companies: {},
    sources: {},
    destinations: [],
    commodities: []
  },
  meta: {},
  tabs: {},
  activePanelId: null,
  activeIndicatorsList: [],
  sourcesPanel: {
    page: 0,
    searchResults: [],
    loadingItems: false,
    activeCountryItemId: null,
    activeSourceItemId: null,
    activeSourceTabId: null
  },
  destinationsPanel: {
    page: 0,
    searchResults: [],
    loadingItems: false,
    activeDestinationItemId: null
  },
  companiesPanel: {
    page: 0,
    searchResults: [],
    loadingItems: false,
    activeCompanyItemId: null,
    activeNodeTypeTabId: null
  },
  commoditiesPanel: {
    page: 0,
    searchResults: [],
    loadingItems: false,
    activeCommodityItemId: null
  }
};

const dashboardElementReducer = {
  [DASHBOARD_ELEMENT__SET_ACTIVE_PANEL](state, action) {
    const { activePanelId } = action.payload;
    const prevActivePanelId = state.activePanelId;
    const prevPanelName = `${prevActivePanelId}Panel`;
    return {
      ...state,
      activePanelId,
      [prevPanelName]: {
        ...state[prevPanelName],
        page: 0
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_PANEL_PAGE](state, action) {
    const { activePanelId } = state;
    const panelName = `${activePanelId}Panel`;
    const { page } = action.payload;
    return { ...state, [panelName]: { ...state[panelName], page } };
  },
  [DASHBOARD_ELEMENT__SET_PANEL_DATA](state, action) {
    const { key, data, meta, tab, loading } = action.payload;
    const metaFallback = meta && meta.contextNodeTypes ? meta.contextNodeTypes : meta; // FIXME
    const initialData = initialState.data[key];
    let newData;
    if (Array.isArray(initialData)) {
      newData = data || initialData;
    } else {
      newData = tab && data ? { ...state.data[key], [tab]: data } : initialData;
    }
    return {
      ...state,
      loading,
      data: { ...state.data, [key]: newData },
      meta: { ...state.meta, [key]: metaFallback }
    };
  },
  [DASHBOARD_ELEMENT__SET_MORE_PANEL_DATA](state, action) {
    const { key, data, tab, direction } = action.payload;
    const oldData = tab ? state.data[key][tab] : state.data[key];
    let together;
    if (direction === 'backwards') {
      together = [...data, ...oldData];
    } else if (direction === 'forwards') {
      together = [...oldData, ...data];
    }
    const newData = tab ? { ...state.data[key], [tab]: together } : together;

    return {
      ...state,
      data: { ...state.data, [key]: newData }
    };
  },
  [DASHBOARD_ELEMENT__SET_LOADING_ITEMS](state, action) {
    const { loadingItems } = action.payload;
    const panelName = `${state.activePanelId}Panel`;
    return {
      ...state,
      [panelName]: {
        ...state[panelName],
        loadingItems
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_PANEL_TABS](state, action) {
    const { data } = action.payload;
    const getSection = n => n.section && n.section.toLowerCase();
    const tabs = data.reduce((acc, next) => ({ ...acc, [getSection(next)]: next.tabs }), {});
    return {
      ...state,
      tabs
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ID](state, action) {
    const { panel, section, active, type } = action.payload;
    const panelName = `${panel}Panel`;
    const page = type === 'tab' || section === 'country' ? 0 : state[panelName].page;
    return {
      ...state,
      activeIndicatorsList: [],
      [panelName]: {
        ...state[panelName],
        page,
        [camelCase(`active_${section}_${type}_id`)]: active
      }
    };
  },
  [DASHBOARD_ELEMENT__CLEAR_PANEL](state, action) {
    const { panel } = action.payload;
    const panelName = `${panel}Panel`;
    const { activeTab, activeTabName } = getActiveTab(state);

    return {
      ...state,
      [panelName]: { ...initialState[panelName], [activeTabName]: activeTab }
    };
  },
  [DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR](state, action) {
    const { active } = action.payload;
    return {
      ...state,
      activeIndicatorsList: [...state.activeIndicatorsList, active.id]
    };
  },
  [DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR](state, action) {
    const { toRemove } = action.payload;
    return {
      ...state,
      activeIndicatorsList: state.activeIndicatorsList.filter(item => item !== toRemove.id)
    };
  },
  [DASHBOARD_ELEMENT__SET_SEARCH_RESULTS](state, action) {
    const { data } = action.payload;
    const panelName = `${state.activePanelId}Panel`;
    return {
      ...state,
      [panelName]: {
        ...state[panelName],
        searchResults: data
      }
    };
  }
};

const dashboardElementReducerTypes = PropTypes => ({
  meta: PropTypes.object.isRequired,
  tabs: PropTypes.object.isRequired,
  activePanelId: PropTypes.string,
  activeIndicatorsList: PropTypes.array.isRequired,
  data: PropTypes.shape({
    indicators: PropTypes.array.isRequired,
    countries: PropTypes.array.isRequired,
    companies: PropTypes.object.isRequired,
    sources: PropTypes.object.isRequired,
    destinations: PropTypes.array.isRequired
  }).isRequired,
  sourcesPanel: PropTypes.shape({
    page: PropTypes.number,
    searchResults: PropTypes.array,
    loadingItems: PropTypes.bool,
    activeCountryItemId: PropTypes.number,
    activeSourceItemId: PropTypes.number,
    activeSourceTabId: PropTypes.number
  }).isRequired,
  destinationsPanel: PropTypes.shape({
    page: PropTypes.number,
    searchResults: PropTypes.array,
    loadingItems: PropTypes.bool,
    activeDestinationItemId: PropTypes.number
  }).isRequired,
  companiesPanel: PropTypes.shape({
    page: PropTypes.number,
    searchResults: PropTypes.array,
    loadingItems: PropTypes.bool,
    activeCompanyItemId: PropTypes.number,
    activeNodeTypeTabId: PropTypes.number
  }).isRequired,
  commoditiesPanel: PropTypes.shape({
    page: PropTypes.number,
    searchResults: PropTypes.array,
    loadingItems: PropTypes.bool,
    activeCommodityItemId: PropTypes.number
  }).isRequired
});

export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
