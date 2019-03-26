import createReducer from 'utils/createReducer';
import fuzzySearch from 'utils/fuzzySearch';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import castArray from 'lodash/castArray';
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
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEM_WITH_SEARCH,
  DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH,
  DASHBOARD_ELEMENT__SET_SELECTED_RECOLOR_BY,
  DASHBOARD_ELEMENT__SET_SELECTED_RESIZE_BY,
  DASHBOARD_ELEMENT__SET_CHARTS
} from './dashboard-element.actions';

const initialState = {
  loading: false,
  data: {
    countries: [],
    companies: {},
    sources: {},
    destinations: [],
    commodities: []
  },
  meta: {},
  tabs: {},
  activePanelId: null,
  countriesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: null
  },
  sourcesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: null
  },
  destinationsPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: null
  },
  companiesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: null
  },
  commoditiesPanel: {
    page: 1,
    searchResults: [],
    loadingItems: false,
    activeItems: {},
    activeTab: null
  },
  selectedYears: null,
  selectedResizeBy: null,
  selectedRecolorBy: null,
  charts: []
};

const updateItems = (currentItems, newItem) => {
  const newItems = castArray(newItem);

  // Remove new items if they are included
  const itemsToRemove = [];
  newItems.forEach(i => {
    if (currentItems[i.id]) itemsToRemove.push(i);
  });
  if (itemsToRemove.length > 0) {
    return omit(currentItems, itemsToRemove.map(i => i.id));
  }

  // Add new items otherwise
  const itemsToAdd = {};
  newItems.forEach(i => {
    itemsToAdd[i.id] = i;
  });

  // check that item is of the same type
  const currentType = Object.values(currentItems)[0] && Object.values(currentItems)[0].nodeType;
  const incomingType = newItems[0] && newItems[0].nodeType;

  if (currentType && currentType !== incomingType) {
    return itemsToAdd; // clear old type otherwise
  }

  return { ...currentItems, ...itemsToAdd };
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
    const panelName = `${key}Panel`;

    if (data.length === 0) {
      return {
        ...state,
        [panelName]: {
          ...state[panelName],
          page: state[panelName].page - 1
        }
      };
    }

    const oldData = tab ? state.data[key][tab] : state.data[key];
    let together;
    if (direction === 'backward' && data.length > 0) {
      together = [...data, ...oldData];
    } else if (direction === 'forward' && data.length > 0) {
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
    const activePanelTabs = tabs[state.activePanelId];
    const firstTab = activePanelTabs && activePanelTabs[0];
    const existingTab =
      activePanelTabs &&
      activePanelTabs.find(
        tab => tab.id === (state[panelName].activeTab && state[panelName].activeTab.id)
      );
    return {
      ...state,
      tabs,
      [panelName]: {
        ...state[panelName],
        activeTab: existingTab || firstTab,
        page: initialState[panelName].page
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEM](state, action) {
    const { panel, activeItem } = action.payload;
    const panelName = `${panel}Panel`;
    const sourcesPanelState =
      panel === 'countries' ? initialState.sourcesPanel : state.sourcesPanel;
    const activeItems = isEmpty(activeItem) ? {} : { [activeItem.id]: activeItem };
    return {
      ...state,
      sourcesPanel: sourcesPanelState,
      [panelName]: {
        ...state[panelName],
        activeItems
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS](state, action) {
    const { panel, activeItems: selectedItem } = action.payload;
    const panelName = `${panel}Panel`;
    return {
      ...state,
      sourcesPanel: state.sourcesPanel,
      [panelName]: {
        ...state[panelName],
        activeItems: updateItems(state[panelName].activeItems, selectedItem)
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_TAB](state, action) {
    const { panel, activeTab } = action.payload;
    const panelName = `${panel}Panel`;
    const prevTab = state[panelName].activeTab;
    const clearedActiveTabData =
      prevTab && prevTab.id !== activeTab.id ? { [prevTab.id]: null } : {};

    return {
      ...state,
      data: {
        ...state.data,
        [panel]: {
          ...state.data[panel],
          ...clearedActiveTabData
        }
      },
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
    const prevTab = state[panelName].activeTab;
    const clearedActiveTabData =
      prevTab && prevTab.id !== activeItem.nodeTypeId ? { [prevTab.id]: null } : {};
    const activeTab =
      state.tabs[panel] && state.tabs[panel].find(tab => tab.id === activeItem.nodeTypeId);

    return {
      ...state,
      data: {
        ...state.data,
        [panel]: {
          ...state.data[panel],
          ...clearedActiveTabData
        }
      },
      [panelName]: {
        ...state[panelName],
        activeItems: { [activeItem.id]: activeItem },
        activeTab,
        page: initialState[panelName].page
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEMS_WITH_SEARCH](state, action) {
    const { panel, activeItems: selectedItem } = action.payload;
    const panelName = `${panel}Panel`;
    const prevTab = state[panelName].activeTab;
    const clearedActiveTabData = prevTab ? { [prevTab.id]: null } : {};
    const activeTab =
      state.tabs[panel] && state.tabs[panel].find(tab => tab.id === selectedItem.nodeTypeId);

    return {
      ...state,
      data: {
        ...state.data,
        [panel]: {
          ...state.data[panel],
          ...clearedActiveTabData
        }
      },
      [panelName]: {
        ...state[panelName],
        activeItems: updateItems(state[panelName].activeItems, selectedItem),
        activeTab,
        page: initialState[panelName].page
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
  [DASHBOARD_ELEMENT__CLEAR_PANELS](state, action) {
    const { panels } = action.payload;
    const removedPanels = {};
    panels.forEach(panel => {
      const panelName = `${panel}Panel`;
      const { activeTab } = state[panelName];
      removedPanels[panelName] = { ...initialState[panelName], activeTab };
    });
    return {
      ...state,
      ...removedPanels
    };
  },
  [DASHBOARD_ELEMENT__SET_SEARCH_RESULTS](state, action) {
    const { data, query } = action.payload;
    let panel = state.activePanelId;
    if (state.activePanelId === 'sources' && isEmpty(state.countriesPanel.activeItems)) {
      panel = 'countries';
    }
    const panelName = `${panel}Panel`;
    return {
      ...state,
      [panelName]: {
        ...state[panelName],
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
    const { data } = action.payload;
    return {
      ...state,
      charts: data
    };
  }
};

const dashboardElementReducerTypes = PropTypes => {
  const PanelTypes = {
    page: PropTypes.number,
    searchResults: PropTypes.array,
    loadingItems: PropTypes.bool,
    activeItems: PropTypes.object,
    activeTab: PropTypes.object
  };

  return {
    meta: PropTypes.object.isRequired,
    tabs: PropTypes.object.isRequired,
    activePanelId: PropTypes.string,
    data: PropTypes.shape({
      countries: PropTypes.array.isRequired,
      companies: PropTypes.object.isRequired,
      sources: PropTypes.object.isRequired,
      destinations: PropTypes.array.isRequired
    }).isRequired,
    countriesPanel: PropTypes.shape(PanelTypes).isRequired,
    sourcesPanel: PropTypes.shape(PanelTypes).isRequired,
    destinationsPanel: PropTypes.shape(PanelTypes).isRequired,
    companiesPanel: PropTypes.shape(PanelTypes).isRequired,
    commoditiesPanel: PropTypes.shape(PanelTypes).isRequired,
    selectedYears: PropTypes.arrayOf(PropTypes.number),
    selectedResizeBy: PropTypes.string,
    selectedRecolorBy: PropTypes.string
  };
};

export { initialState };
export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
