import createReducer from 'utils/createReducer';
import {
  PROFILES__SET_ACTIVE_STEP,
  PROFILES__SET_PANEL_DATA,
  PROFILES__SET_MORE_PANEL_DATA,
  PROFILES__SET_PANEL_PAGE,
  PROFILES__SET_LOADING_ITEMS,
  PROFILES__SET_PANEL_TABS,
  PROFILES__SET_ACTIVE_ITEM,
  PROFILES__SET_SEARCH_RESULTS
} from 'react-components/shared/profile-selector/profile-selector.actions';
import isEmpty from 'lodash/isEmpty';
import fuzzySearch from 'utils/fuzzySearch';
import getPanelName from 'utils/getProfilePanelName';

const initialState = {
  activeStep: null,
  activeProfileType: null,
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
    }
  },
  data: {
    commodities: []
  }
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
    const { activeStep } = state;
    const panelName = getPanelName(activeStep);
    const { page } = action.payload;
    return {
      ...state,
      panels: { ...state.panels, [panelName]: { ...state.panels[panelName], page } }
    };
  },
  [PROFILES__SET_PANEL_DATA](state, action) {
    const { panelName, data, meta, tab, loading } = action.payload;
    const initialData = initialState.data[panelName];
    let newData;
    if (Array.isArray(initialData)) {
      newData = data || initialData;
    } else {
      newData = tab ? { ...state.data[panelName], [tab]: data } : initialData;
    }
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
            page: state[panelName].page - 1
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
    const panelName = getPanelName(state.activeStep);
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
    const panelName = getPanelName(state.activeStep);
    const activePanelTabs = tabs[state.activeStep];
    const firstTab = activePanelTabs && activePanelTabs[0];
    const existingTab =
      activePanelTabs &&
      activePanelTabs.find(
        tab => tab.id === (state[panelName].activeTab && state[panelName].activeTab.id)
      );
    return {
      ...state,
      tabs,
      panels: {
        ...state.panels,
        [panelName]: {
          ...state.panels[panelName],
          activeTab: existingTab || firstTab,
          page: initialState[panelName].page
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
  [PROFILES__SET_SEARCH_RESULTS](state, action) {
    const { data, query } = action.payload;
    let panelName = getPanelName(state.activeStep);
    if (state.activeStep === 'sources' && isEmpty(state.panels.countries.activeItems)) {
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
  }
};

const profileSelectorReducerTypes = PropTypes => ({
  activeStep: PropTypes.string
});

export default createReducer(initialState, profileRootReducer, profileSelectorReducerTypes);
