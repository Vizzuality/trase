import immer from 'immer';
import createReducer from 'utils/createReducer';
import fuzzySearch from 'utils/fuzzySearch';
import { getPanelName } from 'utils/getProfilePanelName';
import { NODE_TYPES } from 'constants';
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
} from './profile-selector.actions';
import initialState from './profile-selector.initial-state';

const profilesReducer = {
  [PROFILES__SET_ACTIVE_STEP](state, action) {
    return immer(state, draft => {
      const { activeStep } = action.payload;

      const panelName = getPanelName(state);

      // Reset page on destinations panel to load the first items
      if (panelName === 'destinations') {
        draft.panels.destinations.page = initialState.panels.destinations.page;
      }

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
        if (!draft.data.companies[selectedCountryId]) {
          draft.data.companies[selectedCountryId] = {};
        }
        draft.data.companies[selectedCountryId][tab] = data;

        // Add default dropdown country to selection
        draft.panels.countries.activeItems = [selectedCountryId];
      } else if (tab) {
        draft.data[panelName][tab] = data;
      } else {
        draft.data[panelName] = data || initialData;
      }

      // Select country of production item (there is only one) when country of production its the first tab
      if (panelName === 'sources' && data && data[0].nodeType === NODE_TYPES.countryOfProduction) {
        draft.panels.sources.activeTab = tab;
        draft.panels.sources.activeItems = [data[0].id];

        // Clear other profile items too
        draft.panels.destinations = initialState.panels.destinations;
        draft.panels.companies = initialState.panels.companies;
      }
    });
  },
  [PROFILES__SET_MORE_PANEL_DATA](state, action) {
    const { key: panelName, data, tab } = action.payload;
    return immer(state, draft => {
      if (data.length === 0) {
        draft.panels[panelName].page = state.panels[panelName].page - 1;
      }

      const selectedCountry = state.panels.countries.activeItems;
      const selectedCountryId =
        selectedCountry[0] || (state.data.countries[0] && state.data.countries[0].id);

      let oldData = (tab ? state.data[panelName][tab] : state.data[panelName]) || [];

      if (panelName === 'companies') {
        oldData =
          (state.data[panelName][selectedCountryId] &&
            state.data[panelName][selectedCountryId][tab]) ||
          [];
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
      } else {
        draft.data[panelName] = together;
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
      let active = [];
      if (panel === 'type') {
        draft.panels.type = activeItem;
        return;
      }

      // Clear other panel's items
      if (panel === 'countries') {
        draft.panels.companies = initialState.panels.companies;
        draft.panels.destinations = initialState.panels.destinations;
        draft.panels.sources = initialState.panels.sources;
      }

      if (panel === 'sources') {
        draft.panels.destinations = initialState.panels.destinations;
        draft.panels.companies = initialState.panels.companies;
        draft.panels.commodities = initialState.panels.commodities;
      }

      if (panel === 'companies') {
        draft.panels.destinations = initialState.panels.destinations;
        draft.panels.sources = initialState.panels.sources;
        draft.panels.commodities = initialState.panels.commodities;
      }

      if (panel === 'destinations') {
        draft.panels.companies = initialState.panels.companies;
        draft.panels.sources = initialState.panels.sources;
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

      // If a country source is selected set the country item as active
      if (panel === 'sources') {
        const {
          tabs: { sources },
          data
        } = state;
        const countryTab = sources.find(t => t.profile_type === 'country');
        if (activeTab === countryTab.id) {
          draft.panels.sources.activeItems = [data.sources[countryTab.id][0].id];
        }
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

      const selectedCountry = state.panels.countries.activeItems;
      const selectedCountryId =
        selectedCountry[0] || (state.data.countries[0] && state.data.countries[0].id);

      if (activeTab === prevTab && draft.panels[panel].activeItems[0] === activeItem.id) {
        draft.panels[panel].activeItems = [];
      } else {
        draft.panels[panel].activeItems = [activeItem.id];
      }

      let oldData = (activeTab ? state.data[panel][activeTab] : state.data[panel]) || [];
      if (panel === 'companies') {
        oldData =
          (state.data[panel][selectedCountryId] &&
            state.data[panel][selectedCountryId][activeTab]) ||
          [];
      }
      const dataMap = oldData.reduce((acc, next) => ({ ...acc, [next.id]: true }), {});
      let together = oldData;
      if (!dataMap[activeItem.id]) {
        together = [activeItem, ...oldData];
      }

      const clearActiveTabData = prevTab && prevTab !== activeTab;
      if (panel === 'companies') {
        if (clearActiveTabData && draft.data[panel][selectedCountryId]) {
          draft.data[panel][selectedCountryId][prevTab] = null;
          draft.panels[panel].page = initialState.panels[panel].page;
        }
        if (!draft.data[panel][selectedCountryId]) {
          draft.data[panel][selectedCountryId] = {};
        }
        draft.data[panel][selectedCountryId][activeTab] = together;
      } else if (activeTab) {
        if (clearActiveTabData) {
          draft.data[panel][prevTab] = null;
          draft.panels[panel].page = initialState.panels[panel].page;
        }
        draft.data[panel][activeTab] = together;
      } else {
        draft.data[panel] = together;
      }

      draft.panels[panel].activeTab = activeTab;
      draft.panels[panel].searchResults = [];
    });
  }
};

const profileSelectorReducerTypes = PropTypes => ({
  activeStep: PropTypes.number,
  panels: PropTypes.object,
  data: PropTypes.object,
  tabs: PropTypes.object
});

export default createReducer(initialState, profilesReducer, profileSelectorReducerTypes);
