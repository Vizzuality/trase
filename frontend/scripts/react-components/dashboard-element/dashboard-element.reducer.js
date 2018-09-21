import camelCase from 'lodash/camelCase';
import createReducer from 'utils/createReducer';
import {
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_ACTIVE_ID,
  DASHBOARD_ELEMENT__CLEAR_PANEL
} from './dashboard-element.actions';

const initialState = {
  data: {
    countries: [],
    companies: {},
    jurisdictions: {},
    commodities: []
  },
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
  }
};

const dashboardElementReducerTypes = PropTypes => ({
  data: PropTypes.shape({
    countries: PropTypes.array.isRequired,
    companies: PropTypes.shape({
      importers: PropTypes.array.isRequired,
      exporters: PropTypes.array.isRequired
    }).isRequired,
    jurisdictions: PropTypes.shape({
      biome: PropTypes.array.isRequired,
      state: PropTypes.array.isRequired,
      municipality: PropTypes.array.isRequired
    }).isRequired
  }).isRequired,
  sourcingPanel: PropTypes.shape({
    activeCountryItemId: PropTypes.string.isRequired,
    activeJurisdictionItemId: PropTypes.string.isRequired,
    activeJurisdictionTabId: PropTypes.string.isRequired
  }).isRequired,
  importingPanel: PropTypes.shape({
    activeJurisdictionItemId: PropTypes.string.isRequired
  }).isRequired,
  companiesPanel: PropTypes.shape({
    activeCompanyItemId: PropTypes.string.isRequired,
    activeNodeTypeTabId: PropTypes.string.isRequired
  }).isRequired,
  commoditiesPanel: PropTypes.shape({
    activeCommodityItemId: PropTypes.string.isRequired
  }).isRequired
});

export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
