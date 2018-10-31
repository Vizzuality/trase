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
  DASHBOARD_ELEMENT__SET_SEARCH_RESULTS,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH
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
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItem: null,
    activeTab: null
  },
  sourcesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItem: null,
    activeTab: null
  },
  destinationsPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItem: null,
    activeTab: null
  },
  companiesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItem: null,
    activeTab: null
  },
  commoditiesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItem: null,
    activeTab: null
  }
};

const dashboardElementReducer = {
  [DASHBOARD_ELEMENT__SET_ACTIVE_PANEL](state, action) {
    const { activePanelId } = action.payload;
    const prevActivePanelId = state.activePanelId;
    const prevPanelName = `${prevActivePanelId}Panel`;
    const prevPanelState = prevActivePanelId
      ? {
          ...state[prevPanelName],
          page: initialState[prevPanelName].page
        }
      : undefined;
    return {
      ...state,
      activePanelId,
      [prevPanelName]: prevPanelState
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
    const initialData = initialState.data[key];
    let newData;
    if (Array.isArray(initialData)) {
      newData = data || initialData;
    } else {
      newData = tab ? { ...state.data[key], [tab]: data } : initialData;
    }
    return {
      ...state,
      loading,
      data: { ...state.data, [key]: newData },
      meta: { ...state.meta, [key]: meta }
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
    const firstTab = tabs[state.activePanelId] && tabs[state.activePanelId][0];
    return {
      ...state,
      tabs,
      [panelName]: {
        ...state[panelName],
        activeTab: state[panelName].activeTab || firstTab,
        page: initialState[panelName].page
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEM](state, action) {
    const { panel, activeItem } = action.payload;
    const panelName = `${panel}Panel`;
    const sourcesPanelState =
      panel === 'countries' ? initialState.sourcesPanel : state.sourcesPanel;
    return {
      ...state,
      activeIndicatorsList: [],
      sourcesPanel: sourcesPanelState,
      [panelName]: {
        ...state[panelName],
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
        activeTab,
        page: initialState[panelName].page
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH](state, action) {
    const { panel, activeItem } = action.payload;
    const panelName = `${panel}Panel`;
    const activeTab = state.tabs[panel].find(tab => tab.id === activeItem.nodeTypeId);
    return {
      ...state,
      activeIndicatorsList: [],
      [panelName]: {
        ...state[panelName],
        activeItem,
        activeTab
      }
    };
  },
  [DASHBOARD_ELEMENT__CLEAR_PANEL](state, action) {
    const { panel } = action.payload;
    const panelName = `${panel}Panel`;
    const { activeTab } = state[panelName];
    const shouldResetCountries = ['countries', 'sources'].includes(panel);
    const countriesState = shouldResetCountries
      ? initialState.countriesPanel
      : state.countriesPanel;

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
    let panel = state.activePanelId;
    if (state.activePanelId === 'sources' && state.countriesPanel.activeItem === null) {
      panel = 'countries';
    }
    const panelName = `${panel}Panel`;
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

export { initialState };
export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
