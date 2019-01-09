import { redirect } from 'redux-first-router';

export const LOGISTICS_MAP__SET_COMPANIES = 'LOGISTICS_MAP__SET_COMPANIES';

const updateQueryParams = params => (dispatch, getState) => {
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
  updateQueryParams({ commodity, layers: [], year: undefined, inspection_level: undefined });
export const selectLogisticsMapInspectionLevel = inspection =>
  updateQueryParams({ inspection_level: inspection });

export const setLayerActive = (layerId, active) => (dispatch, getState) => {
  const { query = {} } = getState().location;
  const { layers = [] } = query;
  let newLayers;

  if (active) {
    newLayers = [...layers, layerId];
  } else {
    newLayers = layers.filter(l => l !== layerId);
  }
  return dispatch({
    type: 'logisticsMap',
    payload: {
      query: {
        ...query,
        layers: newLayers
      }
    }
  });
};

export const getLogisticsMapCompanies = () => (dispatch, getState) => {
  const url = `https://${CARTO_ACCOUNT}.carto.com/api/v1/sql?q=select distinct company from (SELECT company as name FROM brazil_crushing_facilities union all select company from brazil_storage_facilities_sample union all select company from brazil_refining_facilities) as companies order by company asc`;

  if (getState().logisticsMap.companies.length === 0) {
    fetch(url)
      .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(data => dispatch({ type: LOGISTICS_MAP__SET_COMPANIES, payload: data }))
      .catch(e => console.error(e));
  }
};
