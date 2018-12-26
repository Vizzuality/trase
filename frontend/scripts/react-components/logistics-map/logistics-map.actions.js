import { redirect } from 'redux-first-router';

export const selectLogisticsMapYear = year => (dispatch, getState) => {
  const { query = {} } = getState().location;
  return dispatch(
    redirect({
      type: 'logisticsMap',
      payload: { query: { ...query, year } }
    })
  );
};

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
