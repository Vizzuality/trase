import camelCase from 'lodash/camelCase';
import createReducer from 'utils/createReducer';
import {
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_ACTIVE_ID,
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR,
  DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR
} from './dashboard-element.actions';

const initialState = {
  data: {
    indicators: [],
    countries: [],
    companies: {},
    jurisdictions: {},
    commodities: []
  },
  activeIndicatorsList: [],
  sourcingPanel: {
    activeCountryItemId: null,
    activeJurisdictionItemId: null,
    activeJurisdictionTabId: 'biome'
  },
  importingPanel: {
    activeJurisdictionItemId: null
  },
  companiesPanel: {
    activeCompanyItemId: null,
    activeNodeTypeTabId: 'importers'
  },
  commoditiesPanel: {
    activeCommodityItemId: null
  }
};

const dashboardElementReducer = {
  [DASHBOARD_ELEMENT__SET_PANEL_DATA](state, action) {
    const { key, data } = action.payload;
    return {
      ...state,
      data: {
        ...state.data,
        [key]: data
      }
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
      activeIndicatorsList: [...state.activeIndicatorsList, active]
    };
  },
  [DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR](state, action) {
    const { toRemove } = action.payload;
    return {
      ...state,
      activeIndicatorsList: state.activeIndicatorsList.filter(item => item.name !== toRemove.name)
    };
  }
};

const dashboardElementReducerTypes = PropTypes => ({
  data: PropTypes.shape({
    indicators: PropTypes.array.isRequired,
    countries: PropTypes.array.isRequired,
    companies: PropTypes.shape({
      importers: PropTypes.array,
      exporters: PropTypes.array
    }).isRequired,
    jurisdictions: PropTypes.shape({
      biome: PropTypes.array,
      state: PropTypes.array,
      municipality: PropTypes.array
    }).isRequired
  }).isRequired,
  sourcingPanel: PropTypes.shape({
    activeCountryItemId: PropTypes.string,
    activeJurisdictionItemId: PropTypes.string,
    activeJurisdictionTabId: PropTypes.string.isRequired
  }).isRequired,
  importingPanel: PropTypes.shape({
    activeJurisdictionItemId: PropTypes.string
  }).isRequired,
  companiesPanel: PropTypes.shape({
    activeCompanyItemId: PropTypes.string,
    activeNodeTypeTabId: PropTypes.string.isRequired
  }).isRequired,
  commoditiesPanel: PropTypes.shape({
    activeCommodityItemId: PropTypes.string
  }).isRequired
});

export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
