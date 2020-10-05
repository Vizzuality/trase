import { redirect } from 'redux-first-router';
import { defaultLayersIds } from 'react-components/logistics-map/logistics-map.selectors';
import axios from 'axios';

export const LOGISTICS_MAP__SET_COMPANIES = 'LOGISTICS_MAP__SET_COMPANIES';
export const LOGISTICS_MAP__SET_ACTIVE_MODAL = 'LOGISTICS_MAP__SET_ACTIVE_MODAL';
export const LOGISTICS_MAP__SET_COMPANY_SEARCH_TERM = 'LOGISTICS_MAP__SET_COMPANY_SEARCH_TERM';

export const updateQueryParams = params => (dispatch, getState) => {
  const { query = {} } = getState().location;
  return dispatch(
    redirect({
      type: 'logisticsMap',
      payload: { query: { ...query, ...params } }
    })
  );
};

export const selectLogisticsMapYear = ([year]) => updateQueryParams({ year });
export const selectLogisticsMapHub = commodity =>
  updateQueryParams({
    commodity,
    layers: defaultLayersIds[commodity],
    year: undefined,
    inspection: undefined,
    companies: undefined
  });
export const selectLogisticsMapInspectionLevel = inspection => updateQueryParams({ inspection });

export const setLayerActive = (layerId, active) => (dispatch, getState) => {
  const { query = { commodity: 'soy' } } = getState().location;
  const { layers = [] } = query;
  let newLayers;

  if (active) {
    newLayers = [...layers, layerId];
  } else {
    const currentLayers = layers.length > 0 ? layers : defaultLayersIds[query.commodity];
    newLayers = currentLayers.filter(l => l !== layerId);
  }
  return dispatch(updateQueryParams({ layers: newLayers }));
};

export const getLogisticsMapCompanies = () => (dispatch, getState) => {
  const {
    logisticsMap,
    location: { query = {} }
  } = getState();

  const { commodity = 'soy' } = query;

  const queries = {
    soy:
      'select distinct company from (SELECT company FROM brazil_crushing_facilities union all select company from brazil_storage_facilities union all select company from brazil_refining_facilities) as companies order by company asc',
    cattle:
      'select distinct company FROM brazil_slaughterhouses_simple_2018_09_18 order by company asc',
    palmOil: 'select distinct company FROM indonesia_mills_20190613 order by company asc'
  };
  const url = `https://${CARTO_ACCOUNT}.carto.com/api/v1/sql?q=${queries[commodity]}`;
  if (!logisticsMap.companies[commodity]) {
    axios
      .get(url)
      .then(res => res.data)
      .then(data =>
        dispatch({
          type: LOGISTICS_MAP__SET_COMPANIES,
          payload: { data, commodity }
        })
      )
      .catch(e => console.error(e));
  }
};

export const setCompanyActive = (companyName, active) => (dispatch, getState) => {
  const { query = {} } = getState().location;
  const { companies = [] } = query;
  let newCompanies;
  if (active) {
    newCompanies = [...companies, companyName];
  } else {
    newCompanies = companies.filter(l => l !== companyName);
  }
  return dispatch(updateQueryParams({ companies: newCompanies }));
};

export const setCompanySearchTerm = term => ({
  type: LOGISTICS_MAP__SET_COMPANY_SEARCH_TERM,
  payload: term
});

export const setLogisticsMapActiveModal = modal => ({
  type: LOGISTICS_MAP__SET_ACTIVE_MODAL,
  payload: modal
});
