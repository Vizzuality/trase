/* eslint-disable */
import { TOGGLE_DROPDOWN } from 'actions/app.actions';
import { HIGHLIGHT_NODE } from 'actions/tool.actions';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import isEqual from 'lodash/isEqual';
import qs from 'qs';
import { LOAD_STATE_FROM_URL } from 'scripts/actions/app.actions';
import { getContextById } from 'scripts/reducers/helpers/contextHelper';

// remove all params that are now in the state
const removeEmptyParams = params => pickBy(params, param => typeof param !== 'undefined');

const appStateToURLParams = state => {
  if (isEmpty(state.app) || isEmpty(state.tool)) {
    return {};
  }

  return {
    selectedContextId: state.app.selectedContext ? state.app.selectedContext.id : null,
    selectedYears: state.tool.selectedYears,
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

const URLParamsToAppState = (params, state) => {
  const appReducerState = removeEmptyParams({
    initialSelectedContextIdFromURL: params.selectedContextId
  });

  if (typeof params.selectedContextId !== 'undefined' && state.app.contexts.length > 0) {
    appReducerState.selectedContext = getContextById(state, params.selectedContextId);
  }

  const toolReducerState = removeEmptyParams({
    selectedYears: params.selectedYears,
    detailedView: params.detailedView,
    selectedNodesIds: params.selectedNodesIds,
    expandedNodesIds: params.expandedNodesIds,
    areNodesExpanded: params.areNodesExpanded,
    selectedColumnsIds: params.selectedColumnsIds,
    selectedMapDimensions: params.selectedMapDimensions,
    isMapVisible: params.isMapVisible,
    mapView: params.mapView,
    expandedMapSidebarGroupsIds: params.expandedMapSidebarGroupsIds,
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
  return USE_PLAIN_URL_STATE ? JSON.parse(state) : JSON.parse(atob(state));
};

export const parse = url => {
  const params = qs.parse(url);
  if (params.state) {
    return decodeStateFromURL(params.state);
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

export const rehydrateAppStateFromToolURL = (action, next, state) => {
  let urlState = null; // prev state
  if (action.payload && action.payload.query && action.payload.query.state) {
    urlState = { ...action.payload.query.state };
  } else if (action && action.meta && action.meta.query) {
    urlState = { ...action.meta.query };
  }
  // need to rehydrate state
  if (urlState) {
    next({
      type: LOAD_STATE_FROM_URL,
      payload: URLParamsToAppState(urlState, state)
    });
  }
  return next(action);
};

export const toolUrlStateMiddleware = store => next => action => {
  const prevLocation = store.getState().location;
  const prevUrlState = filterStateToURL(store.getState());
  if (
    [HIGHLIGHT_NODE, TOGGLE_DROPDOWN].includes(action.type) ||
    (prevLocation.prev.type !== '' && prevLocation.type !== 'tool' && action.type !== 'tool')
  ) {
    //Not in the sankey, or actions are not part of the URL updating ones. Bail
    return next(action);
  }

  const result = rehydrateAppStateFromToolURL(action, next, store.getState());
  const state = store.getState();
  const { location } = state; // next state

  const newUrlState = filterStateToURL(state);
  const areNotEqual = !isEqual(newUrlState, prevUrlState);
  const conditions = [location.type === 'tool', areNotEqual];
  if (!conditions.includes(false)) {
    window.history.replaceState(
      newUrlState,
      'TRASE - ' + location.type,
      '/flows?' + stringify({ state })
    );
  }
  return result;
};
