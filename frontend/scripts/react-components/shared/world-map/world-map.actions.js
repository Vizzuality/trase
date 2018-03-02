/* eslint-disable camelcase */
import { getURLFromParams, GET_TOP_NODES_URL } from 'utils/getURLFromParams';

export const WORLD_MAP__SET_TOP_NODES = 'WORLD_MAP__SET_TOP_NODES';

export const setWorldMapTopNodes = () => (dispatch, getState) => {
  const { selectedContext, selectedYears: [year_start, year_end] } = getState().tool;
  const { flows } = getState().worldMap;
  const params = {
    year_start,
    year_end,
    context_id: selectedContext.id,
    column_id: 8
  };
  const flowKey = `${selectedContext.id}_${year_start}_${year_end}`;
  const url = getURLFromParams(GET_TOP_NODES_URL, params);
  return (
    !flows[flowKey] &&
    fetch(url)
      .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(res =>
        dispatch({
          type: WORLD_MAP__SET_TOP_NODES,
          payload: { flowKey, data: res.data }
        })
      )
      .catch(error => console.error(error))
  );
};
