import axios from 'axios';
import { appActions } from 'app/app.register';
import {
  GET_TOOLTIPS_URL,
  getURLFromParams,
  GET_CONTEXTS_URL,
  GET_ATTRIBUTES_META
} from 'utils/getURLFromParams';
import getPageTitle from 'router/page-title';

function loadTooltipsPromise(dispatch, getState) {
  const { app } = getState();
  if (app.loading.tooltips || app.tooltips !== null) {
    return Promise.resolve();
  }

  const tooltipsURL = getURLFromParams(GET_TOOLTIPS_URL);

  dispatch({
    type: appActions.APP__SET_LOADING,
    payload: { tooltips: true }
  });

  return new Promise(resolve =>
    axios
      .get(tooltipsURL)
      .then(res => res.data)
      .then(data => {
        dispatch({
          type: appActions.SET_TOOLTIPS,
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
    type: appActions.APP__SET_LOADING,
    payload: { contexts: true }
  });
  return axios
    .get(contextURL)
    .then(resp => resp.data)
    .then(json => {
      const contexts = json.data.sort(sortContexts);

      dispatch({
        type: appActions.SET_CONTEXTS,
        payload: contexts
      });

      document.title = getPageTitle(getState());
    });
}

function loadAttributesMeta(dispatch, getState) {
  const { app } = getState();
  // Attributets should only load once
  if (app.loading.attributesMeta || app.attributesMeta.length > 0) {
    return Promise.resolve();
  }

  const contextURL = getURLFromParams(GET_ATTRIBUTES_META);
  dispatch({
    type: appActions.APP__SET_LOADING,
    payload: { atttributesMeta: true }
  });

  return axios
    .get(contextURL)
    .then(resp => resp.data)
    .then(json => {
      dispatch({
        type: appActions.SET_ATTRIBUTES_META,
        payload: json
      });
    });
}

export default function(dispatch, getState) {
  return Promise.all([
    loadTooltipsPromise(dispatch, getState),
    loadAttributesMeta(dispatch, getState),
    loadContextsPromise(dispatch, getState)
  ]).catch(e => console.error(e));
}
