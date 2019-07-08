import createReducer from 'utils/createReducer';
import {
  PROFILES__SET_ACTIVE_STEP,
  PROFILES__SET_PANEL_DATA,
  PROFILES__SET_MORE_PANEL_DATA,
  PROFILES__SET_PANEL_PAGE,
  PROFILES__SET_LOADING_ITEMS,
  PROFILES__SET_PANEL_TABS,
  PROFILES__SET_ACTIVE_ITEM,
  PROFILES__SET_SEARCH_RESULTS,
  PROFILES__CLEAR_PANEL,
  PROFILES__SET_ACTIVE_TAB,
  PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH,
  PROFILES__CLEAR_PANELS
} from 'react-components/shared/profile-selector/profile-selector.actions';
import isEmpty from 'lodash/isEmpty';
import fuzzySearch from 'utils/fuzzySearch';
import getPanelStepName, { getPanelName } from 'utils/getProfilePanelName';

const initialState = {
  activeStep: null,
  panels: {
    types: {
      activeItems: {}
    },
    commodities: {
      page: 1,
      searchResults: [],
      loadingItems: false,
      activeItems: {},
      activeTab: null
    },
    countries: {
      page: 1,
      searchResults: [],
      loadingItems: false,
      activeItems: {},
      activeTab: null
    },
    sources: {
      page: 1,
      searchResults: [],
      loadingItems: false,
      activeItems: {},
      activeTab: null
    },
    destinations: {
      page: 1,
      searchResults: [],
      loadingItems: false,
      activeItems: {},
      activeTab: null
    },
    companies: {
      page: 1,
      searchResults: [],
      loadingItems: false,
      activeItems: {},
      activeTab: null
    }
  },
  data: {
    commodities: [],
    countries: [],
    sources: [],
    companies: []
  },
  meta: {},
  tabs: {}
};

const profileRootReducer = {
  [PROFILES__SET_ACTIVE_STEP](state, action) {
    const { activeStep } = action.payload;
    return {
      ...state,
      activeStep
    };
  },
  [PROFILES__SET_PANEL_PAGE](state, action) {
    const panelName = getPanelName(state);
    const { page } = action.payload;
    return {
      ...state,
      panels: { ...state.panels, [panelName]: { ...state.panels[panelName], page } }
    };
  },
  [PROFILES__SET_PANEL_DATA](state, action) {
    const { panelName, data, meta, tab, loading } = action.payload;
    const initialData = initialState.data[panelName];
    const newData = tab
      ? { ...state.data[panelName], [tab]: data || initialData }
      : data || initialData;
    return {
      ...state,
      loading,
      data: { ...state.data, [panelName]: newData },
      meta: { ...state.meta, [panelName]: meta }
    };
  },
  [PROFILES__SET_MORE_PANEL_DATA](state, action) {
    const { key, data, tab, direction } = action.payload;
    const panelName = key;
    if (data.length === 0) {
      return {
        ...state,
        panels: {
          ...state.panels,
          [panelName]: {
            ...state.panels[panelName],
            page: state.panels[panelName].page - 1
          }
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
  [PROFILES__SET_LOADING_ITEMS](state, action) {
    const { loadingItems } = action.payload;
    const panelName = getPanelStepName(state.activeStep);
    return {
      ...state,
      panels: {
        ...state.panels,
        [panelName]: {
          ...state.panels[panelName],
          loadingItems
        }
      }
    };
  },
  [PROFILES__SET_PANEL_TABS](state, action) {
    const { data } = action.payload;
    const getSection = n => n.section && n.section.toLowerCase();
    const tabs = data.reduce((acc, next) => ({ ...acc, [getSection(next)]: next.tabs }), {});
    const panelName = getPanelName(state);
    const activePanelTabs = tabs[panelName];
    const firstTab = activePanelTabs && activePanelTabs[0];
    const existingTab =
      activePanelTabs &&
      activePanelTabs.find(tab => tab.id === state.panels[panelName].activeTab?.id);
    return {
      ...state,
      tabs,
      panels: {
        ...state.panels,
        [panelName]: {
          ...state.panels[panelName],
          activeTab: existingTab || firstTab,
          page: initialState.panels[panelName].page
        }
      }
    };
  },
  [PROFILES__SET_ACTIVE_ITEM](state, action) {
    const { panel, activeItem } = action.payload;
    let activeItems = {};
    if (panel === 'types') {
      activeItems = { type: activeItem };
    } else if (!isEmpty(activeItem)) {
      activeItems = { [activeItem.id]: activeItem };
    }
    return {
      ...state,
      panels: {
        ...state.panels,
        [panel]: {
          ...state.panels[panel],
          activeItems
        }
      }
    };
  },
  [PROFILES__CLEAR_PANEL](state, action) {
    const { panel } = action.payload;
    const { activeTab } = state.panels[panel];
    const shouldResetCountries = ['countries', 'sources'].includes(panel);
    const countriesState = shouldResetCountries
      ? initialState.panels.countries
      : state.panels.countries;

    return {
      ...state,
      panels: {
        ...state.panels,
        [panel]: { ...initialState.panels[panel], activeTab },
        countries: countriesState
      }
    };
  },
  [PROFILES__SET_ACTIVE_TAB](state, action) {
    const { panel, activeTab } = action.payload;
    let activePanel = panel;
    if (panel === 'profiles') {
      activePanel = state.panels.types.activeItems.type;
    }
    const prevTab = state.panels[activePanel].activeTab;
    const clearedActiveTabData =
      prevTab && prevTab.id !== activeTab.id ? { [prevTab.id]: null } : {};
    return {
      ...state,
      data: {
        ...state.data,
        [activePanel]: {
          ...state.data[activePanel],
          ...clearedActiveTabData
        }
      },
      panels: {
        ...state.panels,
        [activePanel]: {
          ...state.panels[activePanel],
          activeTab,
          page: initialState.panels[activePanel].page
        }
      }
    };
  },
  [PROFILES__SET_SEARCH_RESULTS](state, action) {
    const { data, query } = action.payload;
    let panelName = getPanelName(state);
    if (panelName === 'sources' && isEmpty(state.panels.countries.activeItems)) {
      panelName = 'countries';
    }
    return {
      ...state,
      panels: {
        ...state.panels,
        [panelName]: {
          ...state.panels[panelName],
          searchResults: fuzzySearch(query, data)
        }
      }
    };
  },
  [PROFILES__CLEAR_PANELS](state, action) {
    const { panels } = action.payload;
    const removedPanels = {};
    panels.forEach(panel => {
      const { activeTab } = state.panels[panel];
      removedPanels[panel] = {
        ...initialState.panels[panel],
        activeTab
      };
    });
    return {
      ...state,
      panels: {
        ...state.panels,
        ...removedPanels
      }
    };
  },
  [PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH](state, action) {
    const { panel, activeItems: selectedItem } = action.payload;
    const prevTab = state.panels[panel].activeTab;
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
      panels: {
        ...state.panels,
        [panel]: {
          ...state.panels[panel],
          activeItems: { [selectedItem.id]: selectedItem },
          activeTab,
          page: initialState.panels[panel].page
        }
      }
    };
  }
};

const profileSelectorReducerTypes = PropTypes => ({
  activeStep: PropTypes.number,
  panels: PropTypes.object,
  data: PropTypes.object,
  meta: PropTypes.object,
  tabs: PropTypes.object
});

export default createReducer(initialState, profileRootReducer, profileSelectorReducerTypes);
