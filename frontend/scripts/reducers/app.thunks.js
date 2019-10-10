import { SET_TOOLTIPS, SET_CONTEXTS, APP__SET_LOADING, getColumns } from 'actions/app.actions';
import { GET_TOOLTIPS_URL, getURLFromParams, GET_CONTEXTS_URL } from 'utils/getURLFromParams';

import getPageTitle from 'router/page-title';

function loadTooltipsPromise(dispatch, getState) {
  const { app } = getState();
  if (app.loading.tooltips || app.tooltips !== null) {
    return Promise.resolve();
  }

  const tooltipsURL = getURLFromParams(GET_TOOLTIPS_URL);

  dispatch({
    type: APP__SET_LOADING,
    payload: { tooltips: true }
  });

  return new Promise(resolve =>
    fetch(tooltipsURL)
      .then(res => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(data => {
        dispatch({
          type: SET_TOOLTIPS,
          payload: data
        });
      })
      .then(() => resolve())
  );
}

function loadContextsPromise(dispatch, getState) {
  const { app } = getState();
  // Contexts should only load once
  if (app.loading.contexts || app.contexts.length > 0) {
    return Promise.resolve();
  }

  const sortContexts = (a, b) => {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  };
  const contextURL = getURLFromParams(GET_CONTEXTS_URL);
  dispatch({
    type: APP__SET_LOADING,
    payload: { contexts: true }
  });
  return fetch(contextURL)
    .then(resp => resp.json())
    .then(json => {
      const contexts = json.data.sort(sortContexts);

      dispatch({
        type: SET_CONTEXTS,
        payload: contexts
      });

      document.title = getPageTitle(getState());
    });
}

export default function(dispatch, getState) {
  return Promise.all([
    loadTooltipsPromise(dispatch, getState),
    loadContextsPromise(dispatch, getState)
  ]).catch(e => console.error(e));
}

export const loadAppInitialData = (dispatch, getState, bag) => {
  if (bag?.action?.meta?.location?.kind !== 'redirect') {
    dispatch(getColumns());
  }
};
