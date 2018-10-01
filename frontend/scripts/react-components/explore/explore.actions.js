/* eslint-disable camelcase */
import { getURLFromParams, GET_TOP_NODES_URL } from 'utils/getURLFromParams';

export const EXPLORE__SET_TOP_NODES = 'EXPLORE__SET_TOP_NODES';
export const EXPLORE__SET_SELECTED_TABLE_COLUMN = 'EXPLORE__SET_SELECTED_TABLE_COLUMN';

export const getTopNodesKey = (ctx, col, start, end) =>
  ctx && col && start && end ? `CTX${ctx}_COL${col}_START${start}_END${end}` : null;

export const setExploreTopNodes = column_id => (dispatch, getState) => {
  const state = getState();
  const { selectedContext } = state.app;
  const {
    selectedYears: [start_year, end_year]
  } = state.tool;
  const { topNodes } = state.explore;
  const params = {
    start_year,
    end_year,
    column_id,
    context_id: selectedContext.id
  };
  const topNodesKey = getTopNodesKey(selectedContext.id, column_id, start_year, end_year);
  const url = getURLFromParams(GET_TOP_NODES_URL, params);

  return (
    !topNodes[topNodesKey] &&
    fetch(url)
      .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(res =>
        dispatch({
          type: EXPLORE__SET_TOP_NODES,
          payload: {
            topNodesKey,
            columnId: column_id,
            data: res.data,
            country: selectedContext.countryName
          }
        })
      )
      .catch(error => console.error(error))
  );
};

export const setSelectedTableColumn = column => ({
  type: EXPLORE__SET_SELECTED_TABLE_COLUMN,
  payload: { column }
});
