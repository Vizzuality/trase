/* eslint-disable */
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import qs from 'qs';
import { LOAD_STATE_FROM_URL } from 'scripts/actions/app.actions';
import { getContextById } from 'scripts/reducers/helpers/contextHelper';
import getPageTitle from 'scripts/router/page-title';

// remove all params that are now in the state
const removeEmptyParams = params => pickBy(params, param => typeof param !== 'undefined');

const appStateToURLParams = state => {
  if (isEmpty(state.app) || isEmpty(state.tool)) {
    return {};
  }

  return {
    selectedContextId: state.app.selectedContext ? state.app.selectedContext.id : null,
    selectedYears: state.app.selectedYears,
    detailedView: state.tool.detailedView,
    selectedNodesIds: state.tool.selectedNodesIds,
    expandedNodesIds: state.tool.expandedNodesIds,
    areNodesExpanded: state.tool.areNodesExpanded,
    selectedColumnsIds: state.tool.selectedColumnsIds,
    selectedMapDimensions: state.tool.selectedMapDimensions,
    isMapVisible: state.tool.isMapVisible,
    mapView: state.tool.mapView,
    expandedMapSidebarGroupsIds: state.tool.expandedMapSidebarGroupsIds,
    selectedMapContextualLayers: state.tool.selectedMapContextualLayers,
    selectedMapBasemap: state.tool.selectedMapBasemap,
    selectedResizeByName: state.tool.selectedResizeBy
      ? state.tool.selectedResizeBy.name
      : state.tool.selectedResizeByName,
    selectedRecolorByName: state.tool.selectedRecolorBy
      ? state.tool.selectedRecolorBy.name
      : state.tool.selectedRecolorByName,
    selectedBiomeFilterName: state.tool.selectedBiomeFilter
      ? state.tool.selectedBiomeFilter.name
      : state.tool.selectedBiomeFilterName
  };
};

const _getBoolValue = value => {
  if (typeof value === 'undefined') {
    return undefined;
  }

  return value === true || value === 'true';
};

const _getIntValue = value => {
  if (typeof value === 'undefined') {
    return undefined;
  }

  return parseInt(value, 10);
};

const _getIntArrayValue = value => {
  if (typeof value === 'undefined') {
    return undefined;
  }

  return value.map(i => parseInt(i, 10));
};

const URLParamsToAppState = (params, state) => {
  const appReducerState = removeEmptyParams({
    initialSelectedContextIdFromURL: _getIntValue(params.selectedContextId),
    selectedYears: _getIntArrayValue(params.selectedYears)
  });

  if (
    typeof appReducerState.initialSelectedContextIdFromURL !== 'undefined' &&
    state.app.contexts.length > 0
  ) {
    appReducerState.selectedContext = getContextById(
      state,
      appReducerState.initialSelectedContextIdFromURL
    );
  }

  const toolReducerState = removeEmptyParams({
    detailedView: _getBoolValue(params.detailedView),
    selectedNodesIds: _getIntArrayValue(params.selectedNodesIds),
    expandedNodesIds: _getIntArrayValue(params.expandedNodesIds),
    areNodesExpanded: _getBoolValue(params.areNodesExpanded),
    selectedColumnsIds: _getIntArrayValue(params.selectedColumnsIds),
    selectedMapDimensions: params.selectedMapDimensions,
    isMapVisible: _getBoolValue(params.isMapVisible),
    mapView: params.mapView,
    expandedMapSidebarGroupsIds: _getIntArrayValue(params.expandedMapSidebarGroupsIds),
    selectedMapContextualLayers: params.selectedMapContextualLayers,
    selectedMapBasemap: params.selectedMapBasemap,
    selectedResizeByName: params.selectedResizeByName,
    selectedRecolorByName: params.selectedRecolorByName,
    selectedBiomeFilterName: params.selectedBiomeFilterName
  });

  return {
    app: appReducerState,
    tool: toolReducerState
  };
};

export const filterStateToURL = state => {
  if (isEmpty(state)) {
    return {};
  }

  return appStateToURLParams(state);
};

export const encodeStateToURL = state => {
  const urlProps = JSON.stringify(filterStateToURL(state));
  return USE_PLAIN_URL_STATE ? urlProps : btoa(urlProps);
};

export const decodeStateFromURL = state => {
  if (typeof state === 'string') {
    return USE_PLAIN_URL_STATE ? JSON.parse(state) : JSON.parse(atob(state));
  }
  return state;
};

export const parse = url => {
  const params = qs.parse(url, { arrayLimit: 1000 });
  if (params.state) {
    return decodeStateFromURL(params.state);
  }
  return params;
};

export const stringify = params => {
  return qs.stringify(params, { encodeValuesOnly: true });
};

const stateToURLObject = (state, location) => {
  if (location.type === 'tool') {
    return { state: encodeStateToURL(state) };
  }

  return { ...location.query };
};

export const rehydrateAppStateFromToolURL = (action, next, state) => {
  let urlState = null;
  if (action.payload && action.payload.query && action.payload.query.state) {
    // Loads state from internal calls (like "map" menu link)
    urlState = { ...action.payload.query.state };
  } else if (action && action.meta && action.meta.query) {
    // Loads state from URL query param on page load
    urlState = { ...action.meta.query };
  }
  // need to rehydrate state
  if (urlState) {
    next({
      type: LOAD_STATE_FROM_URL,
      payload: URLParamsToAppState(urlState, state)
    });
  }
};

export const toolUrlStateMiddleware = store => next => action => {
  if (action.type === 'tool') {
    rehydrateAppStateFromToolURL(action, next, store.getState());
  }

  const result = next(action);
  const state = store.getState();
  const { location } = state; // next state

  window.history.replaceState(
    filterStateToURL(state),
    getPageTitle(state),
    location.pathname + '?' + stringify(stateToURLObject(state, location))
  );

  return result;
};
