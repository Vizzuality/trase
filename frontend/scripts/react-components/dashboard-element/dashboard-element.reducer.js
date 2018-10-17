import camelCase from 'lodash/camelCase';
import createReducer from 'utils/createReducer';
import { getActiveTab } from 'react-components/dashboard-element/dashboard-element.selectors';
import {
  DASHBOARD_ELEMENT__SET_PANEL_DATA,
  DASHBOARD_ELEMENT__SET_ACTIVE_ID,
  DASHBOARD_ELEMENT__CLEAR_PANEL,
  DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR,
  DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR,
  DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  DASHBOARD_ELEMENT__SET_PANEL_TABS
} from './dashboard-element.actions';

const INDICATORS_MOCK = [
  {
    chartType: 'bar',
    url:
      'https://api.resourcewatch.org/v1/query/a86d906d-9862-4783-9e30-cdb68cd808b8?sql=SELECT%20fuel1%20as%20x,%20SUM(estimated_generation_gwh)%20as%20y%20FROM%20powerwatch_data_20180102%20%20GROUP%20BY%20%20x%20ORDER%20BY%20y%20desc%20LIMIT%20500&geostore=8de481b604a9d8c3f85d19846a976a3d'
  },
  {
    chartType: 'pie',
    url:
      'https://api.resourcewatch.org/v1/query/e63bb157-4b98-4ecb-81d6-c1b15e79895a?sql=SELECT%20dam_name%20as%20x,%20dam_hgt_m%20as%20y%20FROM%20grand_dams%20%20%20ORDER%20BY%20dam_hgt_m%20desc%20LIMIT%207'
  },
  {
    chartType: 'stackedBar',
    url:
      'https://api.resourcewatch.org/v1/query/b437f9ac-2bb1-4baf-89c5-291494bf83be?sql=SELECT%20year%20as%20x,%20liquids,%20natural_gas,%20coal,%20nuclear,%20renewables%20FROM%20dash_0090_energy_use_electric_power_eia%20ORDER%20BY%20year%20ASC&application=rw'
  }
];

const initialState = {
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
    const { key, data, meta, tab } = action.payload;
    const metaFallback = meta && meta.contextNodeTypes ? meta.contextNodeTypes : meta; // FIXME
    const newData = tab ? { ...state.data[key], [tab]: data } : data;
    const dataWithMock =
      key === 'indicators' && data.map(d => ({ ...d, ...INDICATORS_MOCK[d.id % 3] }));
    return {
      ...state,
      data: { ...state.data, [key]: dataWithMock || newData },
      meta: { ...state.meta, [key]: metaFallback }
    };
  },
  [DASHBOARD_ELEMENT__SET_PANEL_TABS](state, action) {
    const { data } = action.payload;
    const getSection = n => n.section && n.section.toLowerCase();
    const tabs = data.reduce((acc, next) => ({ ...acc, [getSection(next)]: next.tabs }), {});
    return {
      ...state,
      tabs
    };
  },
  [DASHBOARD_ELEMENT__SET_ACTIVE_ID](state, action) {
    const { panel, section, active, type } = action.payload;
    const panelName = `${panel}Panel`;
    return {
      ...state,
      activeIndicatorsList: [],
      [panelName]: {
        ...state[panelName],
        [camelCase(`active_${section}_${type}_id`)]: active
      }
    };
  },
  [DASHBOARD_ELEMENT__CLEAR_PANEL](state, action) {
    const { panel } = action.payload;
    const panelName = `${panel}Panel`;
    const { activeTab, activeTabName } = getActiveTab(state);

    return {
      ...state,
      [panelName]: { ...initialState[panelName], [activeTabName]: activeTab }
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
    activeCommodityItemId: PropTypes.number
  }).isRequired
});

export default createReducer(initialState, dashboardElementReducer, dashboardElementReducerTypes);
