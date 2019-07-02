import { getURLFromParams } from 'utils/getURLFromParams';
import qs from 'query-string';
import sortBy from 'lodash/sortBy';
import { fetchWithCancel } from 'utils/saga-utils';

export const WIDGETS__INIT_ENDPOINT = 'WIDGETS__INIT_ENDPOINT';
export const WIDGETS__SET_ENDPOINT_DATA = 'WIDGETS__SET_ENDPOINT_DATA';
export const WIDGETS__SET_ENDPOINT_ERROR = 'WIDGETS__SET_ENDPOINT_ERROR';
export const WIDGETS__SET_ENDPOINT_ABORTED = 'WIDGETS__SET_ENDPOINT_ABORTED';

export function prepareWidget(endpoints, { endpoint, params, raw }) {
  const key = sortBy(Object.entries(params || { noParams: true }), entry => entry[0])
    .map(([name, value]) => `${name}${value}`)
    .join('_');
  let url = null;
  const current = endpoints[endpoint];
  const cacheMiss = typeof current === 'undefined' || current.key !== key;
  const aborted = current?.aborted;

  if (cacheMiss || aborted) {
    if (raw) {
      url = endpoint;
      if (params) {
        const search = qs.stringify(params, { arrayFormat: 'bracket' });
        url = endpoint.includes('?') ? `${endpoint}&${search}` : `${endpoint}?${search}`;
      }
    } else {
      url = getURLFromParams(endpoint, params);
    }
  }

  return { key, cacheMiss, url, aborted };
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
  const { cacheMiss, key, url, aborted } = prepareWidget(endpoints, { endpoint, params, raw });
  if (cacheMiss || aborted) {
    if (cacheMiss) {
      dispatch({
        type: WIDGETS__INIT_ENDPOINT,
        payload: { endpoint, key }
      });
    }

    const { fetchPromise, source, isCancel } = fetchWithCancel(url);

    fetchPromise()
      .then(res =>
        dispatch({
          type: WIDGETS__SET_ENDPOINT_DATA,
          payload: { ...res.data, endpoint }
        })
      )
      .catch(error => {
        if (isCancel(error)) {
          if (NODE_ENV_DEV) console.warn('Cancel', url);
          dispatch({
            type: WIDGETS__SET_ENDPOINT_ABORTED,
            payload: { endpoint, aborted: true }
          });
        } else {
          dispatch({
            type: WIDGETS__SET_ENDPOINT_ERROR,
            payload: { endpoint, error }
          });
        }
      });

    return source;
  }

  return null;
};
