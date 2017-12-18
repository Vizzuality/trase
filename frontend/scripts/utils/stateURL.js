import _ from 'lodash';
import actions from 'actions';
import qs from 'query-string';
import { redirect } from 'redux-first-router';

export const parse = url => {
  const params = qs.parse(url);
  if ('state' in params) {
    return { ...params, state: decodeStateFromURL(params) };
  }
  return params;
};

export const stringify = ({ state, ...obj }) => {
  const params = qs.stringify(obj);
  if (state) {
    return `state=${encodeStateToURL(state)}&${params}`;
  }
  return params;
};

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

const URL_PARAMS_PROPS = [
  'isMapVisible',
  'selectedNodesIds',
  'selectedYears'
];

const filterStateToURL = state => {
  if (_.isEmpty(state)) {
    return {};
  }

  const stateToSave = _.pick(state, URL_STATE_PROPS);

  stateToSave.selectedResizeByName = state.selectedResizeBy ? state.selectedResizeBy.name : null;
  stateToSave.selectedRecolorByName = state.selectedRecolorBy ? state.selectedRecolorBy.name : null;
  stateToSave.selectedBiomeFilterName = state.selectedBiomeFilter ? state.selectedBiomeFilter.name : null;

  return stateToSave;
};

export const encodeStateToURL = state => {
  const urlProps = JSON.stringify(filterStateToURL(state));
  const encoded = btoa(urlProps);
  return encoded;
};

export const decodeStateFromURL = ({ state, ...params }) => {
  const decoded = (state === undefined) ? {} : JSON.parse(atob(state));

  return computeStateQueryParams(decoded, params);
};

const computeStateQueryParams = (state, params) => {
  if (!params) return state;
  const newState = { ...state };
  // if URL contains GET parameters, override hash state prop with it
  URL_PARAMS_PROPS.forEach(prop => {
    let urlParam = params[prop] || '';
    if (urlParam) {
      switch (prop) {
        case 'selectedNodesIds': {
          urlParam = urlParam.replace(/\[|\]/gi, '').split(',').map(nodeId => parseInt(nodeId));
          newState.areNodesExpanded = true;
          newState.expandedNodesIds = urlParam;
          break;
        }
        case 'selectedYears': {
          urlParam = urlParam.replace(/\[|\]/gi, '').split(',').map(year => parseInt(year));
          break;
        }
        case 'isMapVisible': {
          urlParam = (urlParam === 'true');
          break;
        }
      }
      newState[prop] = urlParam;
    }
  });
  return newState;
};

export const toolUrlStateMiddleware = store => next => action => {
  // if highlight action bail
  if (action.type === actions.HIGHLIGHT_NODE) return next(action);
  // get current query params
  const prevLocation = store.getState().location;
  const decoratedAction = { ...action };

  const urlState = prevLocation.query && prevLocation.query.state; // prev state
  if (action.type === actions.LOAD_INITIAL_DATA && urlState) {
    // rehydrate state
    decoratedAction.payload = { ...urlState };
  }
  const result = next(decoratedAction);
  const { location, tool } = store.getState(); // next state
  const conditions = [
    location.type === 'tool',
    action.type !== 'tool',
    action.type !== actions.LOAD_INITIAL_DATA,
    !_.isEqual(computeStateQueryParams(filterStateToURL(tool), location.query), urlState)
  ];
  if (!conditions.includes(false)) {
    const action = redirect({
      type: 'tool',
      payload: { query: { ...location.query, state: tool } }
    });
    store.dispatch(action);
  }
  return result;
};