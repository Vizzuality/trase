import { TOGGLE_DROPDOWN } from 'actions/app.actions';
import { HIGHLIGHT_NODE, LOAD_INITIAL_DATA } from 'actions/tool.actions';
import _ from 'lodash';
import qs from 'query-string';
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

export const URL_PARAMS_PROPS = ['isMapVisible', 'selectedNodesIds', 'selectedYears'];

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
  return USE_PLAIN_URL_STATE ? urlProps : btoa(urlProps);
};

export const computeStateQueryParams = (state, params) => {
  if (!params) return state;
  const parsers = {
    selectedNodesIds(currentState, value) {
      if (!value || value.length === 0) return currentState;
      let selectedNodesIds;
      if (Array.isArray(value)) {
        selectedNodesIds = value.map(nodeId => parseInt(nodeId, 10));
      } else {
        selectedNodesIds = value
          .replace(/\[|\]/gi, '')
          .split(',')
          .map(nodeId => parseInt(nodeId, 10));
      }
      return {
        ...currentState,
        areNodesExpanded: true,
        selectedNodesIds,
        expandedNodesIds: selectedNodesIds
      };
    },
    selectedYears(currentState, value) {
      if (!value) return currentState;
      let selectedYears;
      if (Array.isArray(value)) {
        selectedYears = value.map(year => parseInt(year, 10));
      } else {
        selectedYears = value
          .replace(/\[|\]/gi, '')
          .split(',')
          .map(year => parseInt(year, 10));
      }
      return { ...currentState, selectedYears };
    },
    default(currentState, value, prop) {
      return { ...currentState, [prop]: value };
    }
  };
  let newState = { ...state };
  // if URL contains GET parameters, override hash state prop with it
  URL_PARAMS_PROPS.forEach(prop => {
    const value = params[prop];
    const parser = parsers[prop] || parsers.default;
    newState = { ...parser(newState, value, prop) };
  });
  return newState;
};

export const decodeStateFromURL = state => {
  if (typeof state === 'undefined') {
    return {};
  }
  return USE_PLAIN_URL_STATE ? JSON.parse(state) : JSON.parse(atob(state));
};

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
    const state = encodeStateToURL(computeStateQueryParams(params.state, params.state));
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
  const paramsState = location.query ? location.query.state : {};
  const newState = computeStateQueryParams(filterStateToURL(tool), paramsState);
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
