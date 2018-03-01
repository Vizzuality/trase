/* eslint-disable camelcase */
import { getURLFromParams, GET_TOP_NODES_URL } from 'utils/getURLFromParams';

export const WORLD_MAP__SET_TOP_NODES = 'WORLD_MAP__SET_TOP_NODES';

export const setWorldMapTopNodes = () => (dispatch, getState) => {
  const { selectedContext, selectedYears: [year_start, year_end] } = getState().tool;
  const params = {
    year_start,
    year_end,
    context_id: selectedContext.id,
    column_id: 8
  };
  const url = getURLFromParams(GET_TOP_NODES_URL, params);
  return fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then(res =>
      dispatch({
        type: WORLD_MAP__SET_TOP_NODES,
        payload: { data: res.data, contextId: params.context_id }
      })
    )
    .catch(error => console.error(error));
};
