import camelCase from 'lodash/camelCase';
import createReducer from 'utils/createReducer';
import {
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_ACTIVE_ID,
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR,
  DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL
} from './dashboard-element.actions';

const initialState = {
  data: {
    indicators: [],
    countries: [],
    companies: [],
    sources: [],
    destinations: [],
    commodities: []
  },
  meta: {},
  activePanelId: null,
  activeIndicatorsList: [],
  sourcesPanel: {
    activeCountryItemId: null,
    activeSourceItemId: null,
    activeSourceTabId: null
  },
  destinationsPanel: {
    activeDestinationItemId: null
  },
  companiesPanel: {
    activeCompanyItemId: null,
    activeNodeTypeTabId: null
  },
  commoditiesPanel: {
    activeCommodityItemId: null
  }
};

const dashboardElementReducer = {
  [DASHBOARD_ELEMENT__SET_ACTIVE_PANEL](state, action) {
    const { activePanelId } = action.payload;
    return { ...state, activePanelId };
  },
  [DASHBOARD_ELEMENT__SET_PANEL_DATA](state, action) {
    const { key, data, meta } = action.payload;
    const metaFallback = meta && meta.contextNodeTypes ? meta.contextNodeTypes : meta; // FIXME
    return {
      ...state,
      data: { ...state.data, [key]: data },
      meta: { ...state.meta, [key]: metaFallback }
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ID](state, action) {
    const { panel, section, active, type } = action.payload;
    const panelName = `${panel}Panel`;
    return {
      ...state,
      [panelName]: {
        ...state[panelName],
        [camelCase(`active_${section}_${type}_id`)]: active
      }
    };
  },
  [DASHBOARD_ELEMENT__CLEAR_PANEL](state, action) {
    const { panel } = action.payload;
    const panelName = `${panel}Panel`;
    return {
      ...state,
      [panelName]: initialState[panelName]
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
  }
};

const dashboardElementReducerTypes = PropTypes => ({
  data: PropTypes.shape({
    indicators: PropTypes.array.isRequired,
    countries: PropTypes.array.isRequired,
    companies: PropTypes.array.isRequired,
    sources: PropTypes.array.isRequired,
    destinations: PropTypes.array.isRequired
  }).isRequired,
  sourcesPanel: PropTypes.shape({
    activeCountryItemId: PropTypes.number,
    activeSourceItemId: PropTypes.number,
    activeSourceTabId: PropTypes.number
  }).isRequired,
  destinationsPanel: PropTypes.shape({
    activeDestinationItemId: PropTypes.string
  }).isRequired,
  companiesPanel: PropTypes.shape({
    activeCompanyItemId: PropTypes.string,
    activeNodeTypeTabId: PropTypes.string
  }).isRequired,
  commoditiesPanel: PropTypes.shape({
    activeCommodityItemId: PropTypes.string
  }).isRequired
});

export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
