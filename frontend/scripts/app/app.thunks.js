import axios from 'axios';
import { SET_TOOLTIPS, SET_CONTEXTS, APP__SET_LOADING } from 'app/app.register';
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
    axios
      .get(tooltipsURL)
      .then(res => res.data)
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
  return axios
    .get(contextURL)
    .then(resp => resp.data)
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
