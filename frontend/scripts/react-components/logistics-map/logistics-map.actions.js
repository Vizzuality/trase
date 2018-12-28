import { redirect } from 'redux-first-router';

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
