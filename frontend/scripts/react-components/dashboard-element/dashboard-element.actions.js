/* eslint-disable camelcase */
// import camelCase from 'lodash/camelCase';
import { GET_DASHBOARD_OPTIONS_URL, getURLFromParams } from 'utils/getURLFromParams';

export const DASHBOARD_ELEMENT__SET_PANEL_DATA = 'DASHBOARD_ELEMENT__SET_PANEL_DATA';
export const DASHBOARD_ELEMENT__SET_ACTIVE_PANEL = 'DASHBOARD_ELEMENT__SET_ACTIVE_PANEL';
export const DASHBOARD_ELEMENT__SET_ACTIVE_ID = 'DASHBOARD_ELEMENT__SET_ACTIVE_ID';
export const DASHBOARD_ELEMENT__CLEAR_PANEL = 'DASHBOARD_ELEMENT__CLEAR_PANEL';
export const DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR = 'DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR';
export const DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR =
  'DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR';

export const getDashboardPanelData = (options_type, tab) => (dispatch, getState) => {
  const {
    sourcesPanel,
    companiesPanel,
    destinationsPanel,
    commoditiesPanel
  } = getState().dashboardElement;
  const node_types_ids = {
    sources: sourcesPanel.activeSourceTabId,
    companies: companiesPanel.activeNodeTypeTabId
  }[options_type];
  const params = {
    options_type,
    node_types_ids,
    countries_ids: sourcesPanel.activeCountryItemId
  };

  if (options_type !== 'sources') {
    params.sources_ids = sourcesPanel.activeSourceItemId;
  }

  if (options_type !== 'commodities') {
    params.commodities_ids = commoditiesPanel.activeCommodityItemId;
  }

  if (options_type !== 'destinations') {
    params.destinations_ids = destinationsPanel.activeDestinationItemId;
  }

  if (options_type !== 'companies') {
    params.companies_ids = companiesPanel.activeCompanyItemId;
  }

  const url = getURLFromParams(GET_DASHBOARD_OPTIONS_URL, params);
  const key = options_type !== 'attributes' ? options_type : 'indicators'; // FIXME

  dispatch({
    type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
    payload: { key, tab, data: [], meta: null }
  });

  fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then(json =>
      dispatch({
        type: DASHBOARD_ELEMENT__SET_PANEL_DATA,
        payload: {
          key,
          tab,
          data: json.data,
          meta: json.meta
        }
      })
    );
};

export const setDashboardActivePanel = activePanelId => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_PANEL,
  payload: { activePanelId }
});

export const setDashboardPanelActiveId = ({ type, active, panel, section }) => ({
  type: DASHBOARD_ELEMENT__SET_ACTIVE_ID,
  payload: {
    type,
    panel,
    active,
    section
  }
});

export const clearDashboardPanel = panel => ({
  type: DASHBOARD_ELEMENT__CLEAR_PANEL,
  payload: { panel }
});

export const addActiveIndicator = active => ({
  type: DASHBOARD_ELEMENT__ADD_ACTIVE_INDICATOR,
  payload: { active }
});

export const removeActiveIndicator = toRemove => ({
  type: DASHBOARD_ELEMENT__REMOVE_ACTIVE_INDICATOR,
  payload: { toRemove }
});
