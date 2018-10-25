import createReducer from 'utils/createReducer';
import {
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_ACTIVE_TAB,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM,
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
  countriesPanel: {
    page: 0,
    searchResults: [],
    loadingItems: false,
    activeItem: null
  },
  sourcesPanel: {
    page: 0,
    searchResults: [],
    loadingItems: false,
    activeItem: null,
    activeTab: null
  },
  destinationsPanel: {
    page: 0,
    searchResults: [],
    loadingItems: false,
    activeItem: null
  },
  companiesPanel: {
    page: 0,
    searchResults: [],
    loadingItems: false,
    activeItem: null,
    activeTab: null
  },
  commoditiesPanel: {
    page: 0,
    searchResults: [],
    loadingItems: false,
    activeItem: null
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
    const panelName = `${state.activePanelId}Panel`;
    const activeTab =
      tabs[state.activePanelId] && tabs[state.activePanelId][0] && tabs[state.activePanelId][0].id;
    return {
      ...state,
      tabs,
      [panelName]: {
        ...state[panelName],
        activeTab
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEM](state, action) {
    const { panel, activeItem } = action.payload;
    const panelName = `${panel}Panel`;
    const page = panel === 'countries' ? 0 : state[panelName].page;
    return {
      ...state,
      activeIndicatorsList: [],
      [panelName]: {
        ...state[panelName],
        page,
        activeItem
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_TAB](state, action) {
    const { panel, activeTab } = action.payload;
    const panelName = `${panel}Panel`;
    return {
      ...state,
      activeIndicatorsList: [],
      [panelName]: {
        ...state[panelName],
        activeTab
      }
    };
  },
  [DASHBOARD_ELEMENT__CLEAR_PANEL](state, action) {
    const { panel } = action.payload;
    const panelName = `${panel}Panel`;
    const { activeTab } = state[panelName];
    const countriesState = panel === 'sources' ? initialState.countriesPanel : state.countriesPanel;

    return {
      ...state,
      [panelName]: { ...initialState[panelName], activeTab },
      countriesPanel: countriesState
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

const dashboardElementReducerTypes = PropTypes => {
  const PanelTypes = {
    page: PropTypes.number,
    searchResults: PropTypes.array,
    loadingItems: PropTypes.bool,
    activeItem: PropTypes.number,
    activeTab: PropTypes.number
  };

  return {
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
    countriesPanel: PropTypes.shape(PanelTypes).isRequired,
    sourcesPanel: PropTypes.shape(PanelTypes).isRequired,
    destinationsPanel: PropTypes.shape(PanelTypes).isRequired,
    companiesPanel: PropTypes.shape(PanelTypes).isRequired,
    commoditiesPanel: PropTypes.shape(PanelTypes).isRequired
  };
};

export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
