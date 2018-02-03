import { HIGHLIGHT_NODE, LOAD_INITIAL_DATA } from 'actions/tool.actions';
import _ from 'lodash';
import qs from 'query-string';
import { redirect } from 'redux-first-router';
import { TOGGLE_DROPDOWN } from 'actions/app.actions';

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

const URL_PARAMS_PROPS = ['isMapVisible', 'selectedNodesIds', 'selectedYears'];

export const filterStateToURL = state => {
  if (_.isEmpty(state)) {
    return {};
  }

  const stateToSave = _.pick(state, URL_STATE_PROPS);

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
  return btoa(urlProps);
};

export const computeStateQueryParams = (state, params) => {
  if (!params) return state;
  const newState = { ...state };
  // if URL contains GET parameters, override hash state prop with it
  URL_PARAMS_PROPS.forEach(prop => {
    let urlParam = params[prop];
    if (!urlParam) {
      return;
    }
    switch (prop) {
      case 'selectedNodesIds': {
        if (Array.isArray(urlParam)) {
          urlParam = urlParam.map(nodeId => parseInt(nodeId, 10));
        } else {
          urlParam = urlParam
            .replace(/\[|\]/gi, '')
            .split(',')
            .map(nodeId => parseInt(nodeId, 10));
        }
        newState.areNodesExpanded = true;
        newState.expandedNodesIds = urlParam;
        break;
      }
      case 'selectedYears': {
        if (Array.isArray(urlParam)) {
          urlParam = urlParam.map(year => parseInt(year, 10));
        } else {
          urlParam = urlParam
            .replace(/\[|\]/gi, '')
            .split(',')
            .map(year => parseInt(year, 10));
        }
        break;
      }
    }
    newState[prop] = urlParam;
  });
  return newState;
};

export const decodeStateFromURL = state =>
  typeof state === 'undefined' ? {} : JSON.parse(atob(state));

// remove all params that are now in the state
const removeStateParamsFromQuery = (params, state) =>
  _.pickBy({ ...params, state }, (v, param) => param !== '' && !URL_PARAMS_PROPS.includes(param));

export const parse = url => {
  const params = qs.parse(url);
  if (params.state) {
    const state = decodeStateFromURL(params.state);
    return removeStateParamsFromQuery(params, state);
  }
  return params;
};

export const stringify = params => {
  const needsToComputeState = [...URL_PARAMS_PROPS, 'state'].reduce(
    (acc, next) => typeof params[next] !== 'undefined' || acc,
    false
  );
  if (needsToComputeState) {
    const state = encodeStateToURL(computeStateQueryParams(params.state, params));
    const result = removeStateParamsFromQuery(params, state);
    return qs.stringify(result);
  }
  return qs.stringify(params);
};

export const toolUrlStateMiddleware = store => next => action => {
  const prevLocation = store.getState().location;
  // if highlight action bail
  if ([HIGHLIGHT_NODE, TOGGLE_DROPDOWN].includes(action.type) || prevLocation.type !== 'tool') {
    return next(action);
  }
  const decoratedAction = { ...action };
  let urlState = null; // prev state
  if (prevLocation.query && prevLocation.query.state) {
    // urlState is defined when entering the app with query params set
    urlState = { ...prevLocation.query.state };
  } else if (prevLocation.search) {
    // sometimes prevLocation.search is defined but urlState isn't when navigating from within the app
    urlState = parse(prevLocation.search).state;
  }
  if (action.type === LOAD_INITIAL_DATA && urlState) {
    // need to rehydrate state
    decoratedAction.payload = urlState;
  }
  const result = next(decoratedAction);
  const { location, tool } = store.getState(); // next state
  const newState = computeStateQueryParams(filterStateToURL(tool), location.query);
  const areNotEqual = !_.isEqual(newState, urlState);
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
        payload: { query: removeStateParamsFromQuery(location.query, newState) }
      })
    );
  }
  return result;
};
