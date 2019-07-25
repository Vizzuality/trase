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
  DASHBOARD_ELEMENT__SET_CONTEXT_DEFAULT_FILTERS,
  DASHBOARD_ELEMENT__SET_CHARTS_LOADING,
  DASHBOARD_ELEMENT__EDIT_DASHBOARD,
  DASHBOARD_ELEMENT__SET_MISSING_DATA
} from './dashboard-element.actions';
import initialState from './dashboard-element.initial-state';
import * as DashboardElementUrlPropHandlers from './dashboard-element.serializers';

const dashboardElementReducer = {
  dashboardElement(state, action) {
    if (action.payload?.serializerParams) {
      const newState = deserialize({
        params: action.payload.serializerParams,
        state: initialState,
        urlPropHandlers: DashboardElementUrlPropHandlers,
        props: [
          'selectedYears',
          'selectedResizeBy',
          'selectedRecolorBy',
          'countriesPanel',
          'commoditiesPanel'
        ]
      });
      return newState;
    }
    return state;
  },
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
  [DASHBOARD_ELEMENT__EDIT_DASHBOARD](state) {
    return { ...state, editMode: true };
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
  [DASHBOARD_ELEMENT__SET_MISSING_DATA](state, action) {
    const { key, data, tab } = action.payload;

    const oldData = tab ? state.data[key][tab] : state.data[key];
    const together = [...oldData, ...data];
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
    const { data, key } = action.payload;
    const getSection = n => n.section && n.section.toLowerCase();
    const tabs = data.reduce((acc, next) => ({ ...acc, [getSection(next)]: next.tabs }), {});
    const panelName = `${key}Panel`;
    return {
      ...state,
      tabs,
      [panelName]: {
        ...state[panelName],
        page: initialState[panelName].page
      }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ITEM](state, action) {
    const { panel, activeItem } = action.payload;
    const panelName = `${panel}Panel`;
    const sourcesPanelState =
      panel === 'countries' ? initialState.sourcesPanel : state.sourcesPanel;
    const activeItems = activeItem ? [activeItem.id] : initialState[panelName].activeItems;
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
    const items = Array.isArray(selectedItem) ? selectedItem.map(i => i.id) : [selectedItem.id];
    const activeItems = xor(state[panelName].activeItems, items);
    return {
      ...state,
      sourcesPanel: state.sourcesPanel,
      [panelName]: {
        ...state[panelName],
        activeItems
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
        activeItems: xor(state[panelName].activeItems, [selectedItem.id]),
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
    if (state.activePanelId === 'sources' && state.countriesPanel.activeItems.length === 0) {
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
  [DASHBOARD_ELEMENT__SET_CONTEXT_DEFAULT_FILTERS](state, action) {
    const { years, resizeBy, recolorBy } = action.payload;
    return {
      ...state,
      selectedYears: years,
      selectedResizeBy: resizeBy.attributeId,
      selectedRecolorBy: recolorBy.attributeId
    };
  },
  [DASHBOARD_ELEMENT__SET_CHARTS_LOADING](state, action) {
    const { loading } = action.payload;
    return {
      ...state,
      chartsLoading: loading
    };
  }
};

const dashboardElementReducerTypes = PropTypes => {
  const PanelTypes = {
    page: PropTypes.number,
    searchResults: PropTypes.array,
    loadingItems: PropTypes.bool,
    activeItems: PropTypes.array,
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
    selectedRecolorBy: PropTypes.string,
    chartsLoading: PropTypes.bool
  };
};

export { initialState };
export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
