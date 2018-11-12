import { getURLFromParams } from 'utils/getURLFromParams';
import qs from 'qs';

export const WIDGETS__INIT_ENDPOINT = 'WIDGETS__INIT_ENDPOINT';
export const WIDGETS__SET_ENDPOINT_DATA = 'WIDGETS__SET_ENDPOINT_DATA';
export const WIDGETS__SET_ENDPOINT_ERROR = 'WIDGETS__SET_ENDPOINT_ERROR';
export const WIDGETS__SET_ENDPOINT_LOADING = 'WIDGETS__SET_ENDPOINT_LOADING';

export function prepareWidget(endpoints, { endpoint, params, raw }) {
  const key = Object.entries(params || { noParams: true })
    .map(([name, value]) => `${name}${value}`)
    .join('_');
  let url = null;
  const cacheMiss = typeof endpoints[endpoint] === 'undefined' || endpoints[endpoint].key !== key;

  if (cacheMiss) {
    if (raw) {
      url = endpoint;
      if (params) {
        const search = qs.stringify(params);
        url = endpoint.includes('?') ? `${endpoint}&${search}` : `${endpoint}?${search}`;
      }
    } else {
      url = getURLFromParams(endpoint, params);
    }
  }

  return { key, cacheMiss, url };
}

export function getWidgetState(query, endpoints) {
  return query.reduce(
    (acc, endpoint) => {
      const current = endpoints[endpoint];
      if (!current) return { loading: true };
      return {
        data: {
          ...acc.data,
          [endpoint]: current.data || null
        },
        meta: {
          ...acc.meta,
          [endpoint]: current.meta || null
        },
        loading: acc.loading || current.loading,
        error: acc.error || current.error
      };
    },
    { data: {}, loading: false, error: null }
  );
}

export const getWidgetData = (endpoint, params, raw) => (dispatch, getState) => {
  const { endpoints } = getState().widgets;
  const { cacheMiss, key, url } = prepareWidget(endpoints, { endpoint, params, raw });
  if (cacheMiss) {
    dispatch({
      type: WIDGETS__INIT_ENDPOINT,
      payload: { endpoint, key }
    });

    fetch(url)
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .then(res =>
        dispatch({
          type: WIDGETS__SET_ENDPOINT_DATA,
          payload: { ...res, endpoint }
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
  }
};
