/* eslint-disable */
import { TOGGLE_DROPDOWN } from 'actions/app.actions';
import { HIGHLIGHT_NODE, LOAD_INITIAL_DATA } from 'actions/tool.actions';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import isEqual from 'lodash/isEqual';
import qs from 'qs';
import { redirect } from 'redux-first-router';

const URL_STATE_PROPS = [
  'selectedContextId',
  'selectedYears',
  'detailedView',
  'selectedNodesIds',
  'expandedNodesIds',
  'areNodesExpanded',
  'selectedColumnsIds',
  'selectedMapDimensions',
  'isMapVisible',
  'mapView',
  'expandedMapSidebarGroupsIds',
  'selectedMapContextualLayers',
  'selectedMapBasemap'
];

export const filterStateToURL = state => {
  if (isEmpty(state)) {
    return {};
  }

  const stateToSave = pick(state, URL_STATE_PROPS);

  stateToSave.selectedResizeByName = state.selectedResizeBy
    ? state.selectedResizeBy.name
    : state.selectedResizeByName;
  stateToSave.selectedRecolorByName = state.selectedRecolorBy
    ? state.selectedRecolorBy.name
    : state.selectedRecolorByName;
  stateToSave.selectedBiomeFilterName = state.selectedBiomeFilter
    ? state.selectedBiomeFilter.name
    : state.selectedBiomeFilterName;
  return stateToSave;
};

export const encodeStateToURL = state => {
  const urlProps = JSON.stringify(filterStateToURL(state));
  return USE_PLAIN_URL_STATE ? urlProps : btoa(urlProps);
};

export const decodeStateFromURL = state => {
  return USE_PLAIN_URL_STATE ? JSON.parse(state) : JSON.parse(atob(state));
};

// remove all params that are now in the state
const removeEmptyParams = (params, state) =>
  pickBy({ ...params, state }, (v, param) => param !== '' || typeof param !== 'undefined');

export const parse = url => {
  const params = qs.parse(url);
  if (params.state) {
    const state = decodeStateFromURL(params.state);
    return removeEmptyParams(params, state);
  }
  return params;
};

export const stringify = params => {
  if (params.state) {
    const { state, ...query } = params;
    return qs.stringify({ ...query, state: encodeStateToURL(state) });
  }
  return qs.stringify(params);
};

export const rehydrateToolState = (action, next, location) => {
  const decoratedAction = { ...action };
  let urlState = null; // prev state
  if (location.query && location.query.state) {
    // urlState is defined when entering the app with query params set
    urlState = { ...location.query.state };
  } else if (location.search) {
    // sometimes prevLocation.search is defined but urlState isn't when navigating from within the app
    urlState = parse(location.search).state;
  }
  if (action.type === LOAD_INITIAL_DATA && urlState) {
    // need to rehydrate state
    decoratedAction.payload = urlState;
  }
  return next(decoratedAction);
};

export const toolUrlStateMiddleware = store => next => action => {
  const prevLocation = store.getState().location;
  const prevUrlState = filterStateToURL(store.getState().tool);
  // if highlight action bail
  if ([HIGHLIGHT_NODE, TOGGLE_DROPDOWN].includes(action.type) || prevLocation.type !== 'tool') {
    return next(action);
  }
  const result = rehydrateToolState(action, next, prevLocation);
  const { location, tool } = store.getState(); // next state

  const newUrlState = filterStateToURL(tool);
  const areNotEqual = !isEqual(newUrlState, prevUrlState);
  const conditions = [
    location.type === 'tool',
    action.type !== 'tool',
    action.type !== LOAD_INITIAL_DATA,
    areNotEqual
  ];
  if (!conditions.includes(false)) {
    store.dispatch(
      redirect({
        type: 'tool',
        payload: { query: removeEmptyParams(location.query, newUrlState) }
      })
    );
  }
  return result;
};
