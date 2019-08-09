import immer from 'immer';
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
  PROFILES__SET_ACTIVE_TAB,
  PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH
} from 'react-components/shared/profile-selector/profile-selector.actions';
import fuzzySearch from 'utils/fuzzySearch';
import { getPanelName } from 'utils/getProfilePanelName';

export const initialState = {
  activeStep: null,
  panels: {
    type: null,
    commodities: {
      page: 1,
      searchResults: [],
      loadingItems: false,
      activeItems: [],
      activeTab: null
    },
    countries: {
      page: 1,
      searchResults: [],
      loadingItems: false,
      activeItems: [],
      activeTab: null
    },
    sources: {
      page: 1,
      searchResults: [],
      loadingItems: false,
      activeItems: [],
      activeTab: null
    },
    companies: {
      page: 1,
      searchResults: [],
      loadingItems: false,
      activeItems: [],
      activeTab: null
    }
  },
  data: {
    commodities: [],
    countries: [],
    sources: {},
    companies: {}
  },
  tabs: {}
};

const profileRootReducer = {
  [PROFILES__SET_ACTIVE_STEP](state, action) {
    return immer(state, draft => {
      const { activeStep } = action.payload;

      draft.activeStep = activeStep;
    });
  },
  [PROFILES__SET_PANEL_PAGE](state, action) {
    return immer(state, draft => {
      const panelName = getPanelName(state);
      const { page } = action.payload;

      draft.panels[panelName].page = page;
    });
  },
  [PROFILES__SET_PANEL_DATA](state, action) {
    return immer(state, draft => {
      const { panelName, data, tab } = action.payload;
      const initialData = initialState.data[panelName];

      if (panelName === 'companies') {
        const selectedCountry = state.panels.countries.activeItems[0];
        const selectedCountryId =
          typeof selectedCountry !== 'undefined' ? selectedCountry : state.data.countries[0].id;
        if (!draft.data[panelName][selectedCountryId]) {
          draft.data[panelName][selectedCountryId] = {};
        }
        draft.data[panelName][selectedCountryId][tab] = data;
      } else if (tab) {
        draft.data[panelName][tab] = data;
      } else {
        draft.data[panelName] = data || initialData;
      }
    });
  },
  [PROFILES__SET_MORE_PANEL_DATA](state, action) {
    const { key: panelName, data, tab } = action.payload;
    return immer(state, draft => {
      if (data.length === 0) {
        draft.panels[panelName].page = state.panels[panelName].page - 1;
      }

      let oldData = state.data[panelName];
      let selectedCountryId = null;
      if (panelName === 'companies') {
        const selectedCountry = state.panels.countries.activeItems;
        selectedCountryId =
          (selectedCountry[0] && selectedCountry[0]) || state.data.countries[0].id;

        oldData = state.data.companies[selectedCountryId][tab];
      } else if (tab) {
        oldData = state.data[panelName][tab];
      }

      const dataMap = data.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});

      const together = [...oldData.filter(item => !dataMap[item.id]), ...data];

      if (panelName === 'companies') {
        if (!draft.data[panelName][selectedCountryId]) {
          draft.data[panelName][selectedCountryId] = {};
        }
        draft.data[panelName][selectedCountryId][tab] = together;
      } else if (tab) {
        draft.data[panelName][tab] = together;
      }
    });
  },
  [PROFILES__SET_LOADING_ITEMS](state, action) {
    const { loadingItems } = action.payload;
    const panelName = getPanelName(state);
    return immer(state, draft => {
      draft.panels[panelName].loadingItems = loadingItems;
    });
  },
  [PROFILES__SET_PANEL_TABS](state, action) {
    return immer(state, draft => {
      const { data, key } = action.payload;
      const panelName = getPanelName(state);
      const getSection = n => n.section && n.section.toLowerCase();
      const panelTabs = data.filter(item => getSection(item) === key);

      draft.tabs = panelTabs.reduce(
        (acc, next) => ({ ...acc, [getSection(next)]: next.tabs }),
        state.tabs
      );

      draft.panels[panelName].page = initialState.panels[panelName].page;
    });
  },
  [PROFILES__SET_ACTIVE_ITEM](state, action) {
    return immer(state, draft => {
      const { panel, activeItem } = action.payload;
      let active = null;
      if (panel === 'type') {
        draft.panels.type = activeItem;
        return;
      }

      if (panel === 'countries') {
        draft.panels.companies = initialState.panels.companies;
        draft.panels.sources = initialState.panels.sources;
      }

      if (panel === 'sources' || panel === 'companies') {
        draft.panels.commodities = initialState.panels.commodities;
      }

      if (activeItem) {
        active = [activeItem.id];
      }
      const activeTab = state.tabs[panel]
        ? state.tabs[panel].find(tab => tab.name === activeItem.nodeType).id
        : null;

      draft.panels[panel].activeItems = active;
      draft.panels[panel].activeTab = activeTab;
    });
  },
  [PROFILES__SET_ACTIVE_TAB](state, action) {
    return immer(state, draft => {
      const { panel, activeTab } = action.payload;
      let activePanel = panel;
      if (panel === 'profiles') {
        activePanel = state.panels.type;
      }
      const prevTab = state.panels[activePanel].activeTab;
      const clearActiveTabData = prevTab && prevTab.id !== activeTab.id;

      if (clearActiveTabData) {
        draft.data[activePanel][prevTab.id] = null;
      }

      draft.panels[activePanel].activeTab = activeTab;
      draft.panels[activePanel].page = initialState.panels[activePanel].page;
    });
  },
  [PROFILES__SET_SEARCH_RESULTS](state, action) {
    return immer(state, draft => {
      const { data, query } = action.payload;
      let panelName = getPanelName(state);
      if (panelName === 'sources' && state.panels.countries.activeItems.length === 0) {
        panelName = 'countries';
      }
      draft.panels[panelName].searchResults = fuzzySearch(query, data);
    });
  },
  [PROFILES__SET_ACTIVE_ITEM_WITH_SEARCH](state, action) {
    return immer(state, draft => {
      const { panel, activeItem } = action.payload;
      const activeTabObj =
        state.tabs[panel] && state.tabs[panel].find(tab => tab.id === activeItem.nodeTypeId);
      const activeTab = activeTabObj?.id || null;

      const prevTab = state.panels[panel].activeTab;

      if (activeTab === prevTab && draft.panels[panel].activeItems[0] === activeItem.id) {
        draft.panels[panel].activeItems = [];
      } else {
        draft.panels[panel].activeItems = [activeItem.id];
      }

      const oldData = (activeTab ? state.data[panel][activeTab] : state.data[panel]) || [];

      let together = oldData;
      if (!oldData.includes(activeItem.id)) {
        together = [activeItem, ...oldData];
      }

      if (activeTab) {
        const clearActiveTabData = prevTab && prevTab !== activeTab;
        if (clearActiveTabData) {
          draft.data[panel][prevTab] = null;
        }
        draft.data[panel][activeTab] = together;
      } else {
        draft.data[panel] = together;
      }

      draft.panels[panel].activeTab = activeTab;
      draft.panels[panel].searchResults = [];
      draft.panels[panel].page = initialState.panels[panel].page;
    });
  }
};

const profileSelectorReducerTypes = PropTypes => ({
  activeStep: PropTypes.number,
  panels: PropTypes.object,
  data: PropTypes.object,
  tabs: PropTypes.object
});

export default createReducer(initialState, profileRootReducer, profileSelectorReducerTypes);
