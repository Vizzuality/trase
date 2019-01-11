import { redirect } from 'redux-first-router';

export const LOGISTICS_MAP__SET_COMPANIES = 'LOGISTICS_MAP__SET_COMPANIES';
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

export const selectLogisticsMapYear = year => updateQueryParams({ year });
export const selectLogisticsMapHub = commodity =>
  updateQueryParams({
    commodity,
    layers: [],
    year: undefined,
    inspection: undefined,
    companies: undefined
  });
export const selectLogisticsMapInspectionLevel = inspection => updateQueryParams({ inspection });

export const setLayerActive = (layerId, active) => (dispatch, getState) => {
  const { query = {} } = getState().location;
  const { layers = [] } = query;
  let newLayers;

  if (active) {
    newLayers = [...layers, layerId];
  } else {
    newLayers = layers.filter(l => l !== layerId);
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
      'select distinct company from (SELECT company FROM brazil_crushing_facilities union all select company from brazil_storage_facilities_sample union all select company from brazil_refining_facilities) as companies order by company asc',
    cattle:
      'select distinct company FROM brazil_slaughterhouses_simple_2018_09_18 order by company asc'
  };
  const url = `https://${CARTO_ACCOUNT}.carto.com/api/v1/sql?q=${queries[commodity]}`;

  if (!logisticsMap.companies[commodity]) {
    fetch(url)
      .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
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
