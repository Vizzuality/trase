import { getURLFromParams, GET_TOP_NODES_URL } from 'utils/getURLFromParams';
import { NEWSLETTER__SET_SUBSCRIPTION_MESSAGE } from 'react-components/shared/newsletter/newsletter.actions';

export const WORLD_MAP__SET_TOP_NODES = 'WORLD_MAP__SET_TOP_NODES';

const setWorldMapTopNodes = params => dispatch => {
  const url = getURLFromParams(GET_TOP_NODES_URL, params);
  return fetch(url, {
    method: 'POST',
    body
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then(data =>
      dispatch({
        type: WORLD_MAP__SET_TOP_NODES,
        payload: { data, contextId: params.context_id }
      })
    )
    .catch(error =>
      dispatch({
        type: NEWSLETTER__SET_SUBSCRIPTION_MESSAGE,
        payload: { message: `Error: ${error}` }
      })
    );
};
