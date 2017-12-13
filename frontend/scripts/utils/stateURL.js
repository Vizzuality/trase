import _ from 'lodash';
import actions from 'actions';
import qs from 'query-string';

export const parse = url => {
  const params = qs.parse(url);
  if ('state' in params) {
    return { ...params, state: decodeStateFromURL(params.state) };
  }
  return params;
};

export const stringify = ({ state, ...obj }) => {
  const params = qs.stringify(obj);
  if (state) {
    return encodeStateToURL(state) + params;
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
  window.history.replaceState({}, 'Title', `?state=${encoded}`);
  return encoded;
};

function _getURLParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const decodeStateFromURL = urlHash => {
  const state = (urlHash === undefined) ? {} : JSON.parse(atob(urlHash));

  // if URL contains GET parameters, override hash state prop with it
  URL_PARAMS_PROPS.forEach(prop => {
    let urlParam = _getURLParameterByName(prop);
    if (urlParam) {
      switch (prop) {
        case 'selectedNodesIds': {
          urlParam = urlParam.replace(/\[|\]/gi, '').split(',').map(nodeId => parseInt(nodeId));
          state.areNodesExpanded = true;
          state.expandedNodesIds = urlParam;
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
      state[prop] = urlParam;
    }
  });

  return state;
};

export const toolUrlStateMiddleware = store => next => action => {
  if (action.type === actions.HIGHLIGHT_NODE) return next(action);
  const prevLocation = store.getState().location;
  const decoratedAction = { ...action };
  const urlState = prevLocation.query && prevLocation.query.state; // prev state
  if (action.type === actions.LOAD_INITIAL_DATA && urlState) {
    decoratedAction.payload = { ...urlState };
  }
  const result = next(decoratedAction);
  const { location, tool } = store.getState(); // next state
  const conditions = [
    location.type === 'tool',
    action.type !== 'tool',
    action.type !== actions.LOAD_INITIAL_DATA,
    !_.isEqual(filterStateToURL(tool), urlState)
  ];
  if (!conditions.includes(false)) {
    store.dispatch({
      type: 'tool',
      payload: { query: { state: tool } },
      meta: { location: { prev: location.prev } }
    });
  }
  return result;
};