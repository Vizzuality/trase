import { getURLFromParams } from 'utils/getURLFromParams';

export const WIDGETS__SET_ENDPOINT_DATA = 'WIDGETS__SET_ENDPOINT_DATA';
export const WIDGETS__SET_ENDPOINT_ERROR = 'WIDGETS__SET_ENDPOINT_ERROR';
export const WIDGETS__SET_ENDPOINT_LOADING = 'WIDGETS__SET_ENDPOINT_LOADING';

export const getWidgetData = (endpoint, params) => dispatch => {
  const url = getURLFromParams(endpoint, params);
  dispatch({
    type: WIDGETS__SET_ENDPOINT_LOADING,
    payload: { endpoint, loading: true }
  });

  fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(res)))
    .then(res =>
      dispatch({
        type: WIDGETS__SET_ENDPOINT_DATA,
        payload: { endpoint, data: res.data }
      })
    )
    .catch(error =>
      dispatch({
        type: WIDGETS__SET_ENDPOINT_ERROR,
        payload: { endpoint, error }
      })
    )
    .finally(() =>
      dispatch({
        type: WIDGETS__SET_ENDPOINT_LOADING,
        payload: { endpoint, loading: false }
      })
    );
};
