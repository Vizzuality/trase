/* eslint-disable no-use-before-define */
import { SET_TOOLTIPS } from 'actions/app.actions';
import { LOAD_CONTEXTS } from 'actions/data.actions';
import { feature as topojsonFeature } from 'topojson';
import {
  CARTO_NAMED_MAPS_BASE_URL,
  NUM_NODES_DETAILED,
  NUM_NODES_EXPANDED,
  NUM_NODES_SUMMARY,
  YEARS_DISABLED_NO_AGGR,
  YEARS_DISABLED_UNAVAILABLE
} from 'constants';
import {
  GET_ALL_NODES_URL,
  GET_COLUMNS_URL,
  GET_CONTEXTS_URL,
  GET_FLOWS_URL,
  GET_LINKED_GEO_IDS_URL,
  GET_MAP_BASE_DATA_URL,
  GET_NODE_ATTRIBUTES_URL,
  GET_TOOLTIPS_URL,
  getURLFromParams
} from 'utils/getURLFromParams';
import contextLayersCarto from 'actions/map/context_layers_carto';
import getNodeIdFromGeoId from 'actions/helpers/getNodeIdFromGeoId';
import getNodesSelectionAction from 'actions/helpers/getNodesSelectionAction';
import getSelectedNodesStillVisible from 'actions/helpers/getSelectedNodesStillVisible';
import setGeoJSONMeta from 'actions/helpers/setGeoJSONMeta';
import getNodeMetaUid from 'reducers/helpers/getNodeMetaUid';
import { getSingleMapDimensionWarning } from 'reducers/helpers/getMapDimensionsWarnings';
import isNodeColumnVisible from 'utils/isNodeColumnVisible';
import capitalize from 'lodash/capitalize';
import difference from 'lodash/difference';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';

export const LOAD_INITIAL_DATA = 'LOAD_INITIAL_DATA';
export const RESET_SELECTION = 'RESET_SELECTION';
export const SET_CONTEXT = 'SET_CONTEXT';
export const LOAD_INITIAL_CONTEXT = 'LOAD_INITIAL_CONTEXT';
export const GET_COLUMNS = 'GET_COLUMNS';
export const LOAD_LINKS = 'LOAD_LINKS';
export const LOAD_NODES = 'LOAD_NODES';
export const GET_LINKS = 'GET_LINKS';
export const GET_NODE_ATTRIBUTES = 'GET_NODE_ATTRIBUTES';
export const UPDATE_NODE_SELECTION = 'UPDATE_NODE_SELECTION';
export const HIGHLIGHT_NODE = 'HIGHLIGHT_NODE';
export const FILTER_LINKS_BY_NODES = 'FILTER_LINKS_BY_NODES';
export const SELECT_BIOME_FILTER = 'SELECT_BIOME_FILTER';
export const SELECT_YEARS = 'SELECT_YEARS';
export const SELECT_RESIZE_BY = 'SELECT_RESIZE_BY';
export const SELECT_RECOLOR_BY = 'SELECT_RECOLOR_BY';
export const SELECT_VIEW = 'SELECT_VIEW';
export const SELECT_COLUMN = 'SELECT_COLUMN';
export const GET_MAP_VECTOR_DATA = 'GET_MAP_VECTOR_DATA';
export const GET_CONTEXT_LAYERS = 'GET_CONTEXT_LAYERS';
export const SET_MAP_DIMENSIONS = 'SET_MAP_DIMENSIONS';
export const TOGGLE_MAP_DIMENSION = 'TOGGLE_MAP_DIMENSION';
export const SELECT_CONTEXTUAL_LAYERS = 'SELECT_CONTEXTUAL_LAYERS';
export const SELECT_BASEMAP = 'SELECT_BASEMAP';
export const TOGGLE_MAP = 'TOGGLE_MAP';
export const TOGGLE_NODES_EXPAND = 'TOGGLE_NODES_EXPAND';
export const GET_LINKED_GEOIDS = 'GET_LINKED_GEOIDS';
export const SAVE_MAP_VIEW = 'SAVE_MAP_VIEW';
export const TOGGLE_MAP_SIDEBAR_GROUP = 'TOGGLE_MAP_SIDEBAR_GROUP';
export const SHOW_LINKS_ERROR = 'SHOW_LINKS_ERROR';
export const RESET_TOOL_STATE = 'RESET_TOOL_STATE';
export const SET_SANKEY_SEARCH_VISIBILITY = 'SET_SANKEY_SEARCH_VISIBILITY';

const _reloadLinks = (param, value, type, reloadLinks = true) => dispatch => {
  const action = {
    type
  };
  action[param] = value;
  dispatch(action);
  if (reloadLinks) {
    dispatch(loadLinks());
  }
};

export function selectView(detailedView, reloadLinks) {
  return _reloadLinks('detailedView', detailedView, SELECT_VIEW, reloadLinks);
}

export function resetState(refilter = true) {
  return dispatch => {
    dispatch({
      type: RESET_SELECTION
    });
    if (refilter === true) {
      dispatch({
        type: FILTER_LINKS_BY_NODES
      });
    }
    selectView(false, true);
    dispatch(loadLinks());
  };
}

export function selectContext(context) {
  return dispatch => {
    dispatch(setContext(context));
  };
}

export function selectBiomeFilter(biomeFilter, reloadLinks) {
  return _reloadLinks('biomeFilter', biomeFilter, SELECT_BIOME_FILTER, reloadLinks);
}

export function selectResizeBy(resizeBy, reloadLinks) {
  return _reloadLinks('resizeBy', resizeBy, SELECT_RESIZE_BY, reloadLinks);
}

export function selectRecolorBy(data) {
  return dispatch => {
    dispatch({
      type: SELECT_RECOLOR_BY,
      value: data.value,
      value_type: data.type
    });
    dispatch(loadLinks());
  };
}

export function selectColumn(columnIndex, columnId, reloadLinks = true) {
  return (dispatch, getState) => {
    const state = getState();

    // Action triggered but the column is already present - do nothing
    if (state.tool.selectedColumnsIds.indexOf(columnId) !== -1) {
      return;
    }

    dispatch({
      type: SELECT_COLUMN,
      columnIndex,
      columnId
    });
    const selectedNodesIds = getSelectedNodeIdsNotInColumnIndex(
      state.tool.selectedNodesIds,
      columnIndex,
      state.tool.nodesDict
    );
    dispatch(updateNodes(selectedNodesIds));

    dispatch({
      type: FILTER_LINKS_BY_NODES
    });

    if (reloadLinks) {
      dispatch(loadLinks());
    }
  };
}

export function selectYears(years) {
  return dispatch => {
    dispatch({
      type: SELECT_YEARS,
      years
    });
    dispatch(loadNodes());
    dispatch(loadLinks());
  };
}

export function loadInitialData() {
  return (dispatch, getState) => {
    dispatch({
      type: LOAD_INITIAL_DATA
    });

    const contextURL = getURLFromParams(GET_CONTEXTS_URL);
    const tooltipsURL = getURLFromParams(GET_TOOLTIPS_URL);

    Promise.all([contextURL, tooltipsURL].map(url => fetch(url).then(resp => resp.text()))).then(
      data => {
        const tooltipsPayload = JSON.parse(data[1]);

        dispatch({
          type: SET_TOOLTIPS,
          payload: tooltipsPayload
        });

        const contextPayload = JSON.parse(data[0]).data;
        // load contexts
        dispatch({
          type: LOAD_CONTEXTS,
          payload: contextPayload
        });

        const state = getState();
        const defaultContextId =
          state.tool.selectedContextId ||
          contextPayload.find(context => context.isDefault === true).id;

        dispatch(setContext(defaultContextId, true));
      }
    );
  };
}

export function setContext(contextId, isInitialContextSet = false) {
  return dispatch => {
    // load default params
    dispatch({
      type: isInitialContextSet ? LOAD_INITIAL_CONTEXT : SET_CONTEXT,
      payload: contextId
    });

    const params = {
      context_id: contextId
    };
    const allNodesURL = getURLFromParams(GET_ALL_NODES_URL, params);
    const columnsURL = getURLFromParams(GET_COLUMNS_URL, params);
    const promises = [allNodesURL, columnsURL].map(url => fetch(url).then(resp => resp.text()));

    Promise.all(promises).then(payload => {
      // TODO do not wait for end of all promises/use another .all call
      dispatch({
        type: GET_COLUMNS,
        payload: payload.slice(0, 2)
      });

      dispatch(loadLinks());
      dispatch(loadNodes());
      dispatch(loadMapVectorData());
    });
  };
}

export function loadNodes() {
  return (dispatch, getState) => {
    dispatch({
      type: LOAD_NODES
    });
    const params = {
      context_id: getState().tool.selectedContextId,
      start_year: getState().tool.selectedYears[0],
      end_year: getState().tool.selectedYears[1]
    };

    const getNodesURL = getURLFromParams(GET_NODE_ATTRIBUTES_URL, params);
    const getMapBaseDataURL = getURLFromParams(GET_MAP_BASE_DATA_URL, params);
    const selectedMapDimensions = getState().tool.selectedMapDimensions;
    const promises = [getNodesURL, getMapBaseDataURL].map(url =>
      fetch(url).then(resp => resp.text())
    );

    Promise.all(promises).then(rawPayload => {
      const payload = {
        nodesJSON: JSON.parse(rawPayload[0]),
        mapDimensionsMetaJSON: JSON.parse(rawPayload[1])
      };

      const currentYearBoundaries = getState().tool.selectedYears;
      const allSelectedYears = [];
      for (let i = currentYearBoundaries[0]; i <= currentYearBoundaries[1]; i++) {
        allSelectedYears.push(i);
      }

      payload.mapDimensionsMetaJSON.dimensions.forEach(dimension => {
        if (allSelectedYears.length > 1) {
          dimension.disabledYearRangeReason = YEARS_DISABLED_NO_AGGR;
          dimension.disabledYearRangeReasonText = getSingleMapDimensionWarning(
            dimension.disabledYearRangeReason
          );
        } else {
          const allYearsCovered =
            dimension.years === null ||
            allSelectedYears.every(year => dimension.years.indexOf(year) > -1);
          if (!allYearsCovered) {
            dimension.disabledYearRangeReason = YEARS_DISABLED_UNAVAILABLE;
            dimension.disabledYearRangeReasonText = getSingleMapDimensionWarning(
              dimension.disabledYearRangeReason
            );
          }
        }
      });

      dispatch(setMapContextLayers(payload.mapDimensionsMetaJSON.contextualLayers));

      dispatch({
        type: GET_NODE_ATTRIBUTES,
        payload
      });

      const selectedBiomeFilter = getState().tool.selectedBiomeFilter;
      // reselect biome filter to add biome geoid
      if (selectedBiomeFilter && selectedBiomeFilter.nodeId) {
        dispatch({
          type: SELECT_BIOME_FILTER,
          biomeFilter: getState().tool.selectedBiomeFilter.name
        });
      }

      const allAvailableMapDimensionsUids = payload.mapDimensionsMetaJSON.dimensions.map(
        dimension => getNodeMetaUid(dimension.type, dimension.layerAttributeId)
      );
      const selectedMapDimensionsSet = compact(selectedMapDimensions);

      // are all currently selected map dimensions available ?
      if (
        selectedMapDimensionsSet.length > 0 &&
        difference(selectedMapDimensionsSet, allAvailableMapDimensionsUids).length === 0
      ) {
        dispatch(setMapDimensions(selectedMapDimensions.concat([])));
      } else {
        // use default map dimensions
        const defaultMapDimensions = payload.mapDimensionsMetaJSON.dimensions.filter(
          dimension => dimension.isDefault
        );
        if (defaultMapDimensions !== undefined) {
          const uids = defaultMapDimensions.map(selectedDimension =>
            getNodeMetaUid(selectedDimension.type, selectedDimension.layerAttributeId)
          );
          if (uids[0] === undefined) uids[0] = null;
          if (uids[1] === undefined) uids[1] = null;
          dispatch(setMapDimensions(uids));
        }
      }
    });
  };
}

export function loadLinks() {
  return (dispatch, getState) => {
    dispatch({
      type: LOAD_LINKS
    });
    const state = getState();
    const params = {
      context_id: state.tool.selectedContextId,
      year_start: state.tool.selectedYears[0],
      year_end: state.tool.selectedYears[1],
      include_columns: state.tool.selectedColumnsIds.join(','),
      flow_quant: state.tool.selectedResizeBy.name,
      locked_nodes: state.tool.selectedNodesIds
    };

    if (state.tool.detailedView === true) {
      params.n_nodes = NUM_NODES_DETAILED;
    } else if (state.tool.areNodesExpanded === true) {
      params.n_nodes = NUM_NODES_EXPANDED;
    } else {
      params.n_nodes = NUM_NODES_SUMMARY;
    }

    if (state.tool.selectedRecolorBy) {
      if (state.tool.selectedRecolorBy.type === 'qual') {
        params.flow_qual = state.tool.selectedRecolorBy.name;
      } else if (state.tool.selectedRecolorBy.type === 'ind') {
        params.flow_ind = state.tool.selectedRecolorBy.name;
      }
    }

    const selectedBiomeFilter = state.tool.selectedBiomeFilter;
    if (selectedBiomeFilter && selectedBiomeFilter.name && selectedBiomeFilter.value !== 'none') {
      params.biome_filter_id = selectedBiomeFilter.nodeId;
    }

    if (state.tool.areNodesExpanded) {
      params.selected_nodes = state.tool.expandedNodesIds.join(',');
    }

    const url = getURLFromParams(GET_FLOWS_URL, params);

    fetch(url)
      .then(response => {
        if (response.status === 404) {
          return null;
        }
        return response.text();
      })
      .then(payload => {
        if (!payload) {
          return;
        }
        const jsonPayload = JSON.parse(payload);
        if (jsonPayload.data === undefined || !jsonPayload.data.length) {
          console.error('server returned empty flows/link list, with params:', params);
          dispatch({
            type: SHOW_LINKS_ERROR
          });
          return;
        }

        dispatch({
          type: GET_LINKS,
          jsonPayload
        });

        // reselect nodes ---> FILTER NODE IDS THAT ARE NOT VISIBLE ANYMORE + UPDATE DATA for titlebar
        const selectedNodesIds = getSelectedNodesStillVisible(
          getState().tool.visibleNodes,
          getState().tool.selectedNodesIds
        );

        dispatch(updateNodes(selectedNodesIds));

        if (getState().tool.selectedNodesIds && getState().tool.selectedNodesIds.length > 0) {
          dispatch({
            type: FILTER_LINKS_BY_NODES
          });
        }

        // load related geoIds to show on the map
        dispatch(loadLinkedGeoIDs());
      });
  };
}

export function loadMapVectorData() {
  return (dispatch, getState) => {
    const geoColumns = getState().tool.columns.filter(column => column.isGeo === true);
    const geometriesPromises = [];
    const mapVectorData = {};

    geoColumns.forEach(geoColumn => {
      mapVectorData[geoColumn.id] = {
        name: geoColumn.name,
        useGeometryFromColumnId: geoColumn.useGeometryFromColumnId
      };
      if (geoColumn.useGeometryFromColumnId === undefined) {
        const countryName = getState().tool.selectedContext.countryName;
        const vectorLayerURL = `vector_layers/${countryName}_${geoColumn.name}.topo.json`;
        const geometryPromise = fetch(vectorLayerURL)
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              return response.text();
            }
            return undefined;
          })
          .then(payload => {
            if (payload === undefined) {
              console.warn('missing vector layer file', vectorLayerURL);
              return;
            }
            const topoJSON = JSON.parse(payload);
            const key = Object.keys(topoJSON.objects)[0];
            const geoJSON = topojsonFeature(topoJSON, topoJSON.objects[key]);
            setGeoJSONMeta(
              geoJSON,
              getState().tool.nodesDict,
              getState().tool.geoIdsDict,
              geoColumn.id
            );
            mapVectorData[geoColumn.id].geoJSON = geoJSON;
          });
        geometriesPromises.push(geometryPromise);
      }
    });

    Promise.all(geometriesPromises).then(() => {
      Object.keys(mapVectorData).forEach(id => {
        mapVectorData[id].isPoint =
          mapVectorData[id].geoJSON &&
          mapVectorData[id].geoJSON.features.length &&
          mapVectorData[id].geoJSON.features[0].geometry.type === 'Point';
      });
      dispatch({
        type: GET_MAP_VECTOR_DATA,
        mapVectorData
      });
    });
  };
}

export function resetContextLayers() {
  return dispatch => {
    dispatch({
      type: GET_CONTEXT_LAYERS,
      mapContextualLayers: []
    });
    dispatch({
      type: SELECT_CONTEXTUAL_LAYERS,
      contextualLayers: []
    });
  };
}

export function setMapContextLayers(contextualLayers) {
  return (dispatch, getState) => {
    const mapContextualLayers = contextualLayers.map(layer => {
      const contextLayer = Object.assign({}, layer);
      const carto = contextLayersCarto[layer.identifier];
      if (!layer.rasterUrl && carto) {
        contextLayer.cartoURL = `${CARTO_NAMED_MAPS_BASE_URL}${carto.uid}/jsonp?callback=cb`;
        contextLayer.layergroupid = carto.layergroupid;
      }
      return contextLayer;
    });

    resetContextLayers();

    Promise.all(
      mapContextualLayers
        .filter(l => l.cartoURL)
        .map(l => fetch(l.cartoURL).then(resp => resp.text()))
    ).then(() => {
      // we actually don't care about layergroupids because we already have them pregenerated
      // this is just about reinstanciating named maps, you know, because CARTO
      dispatch({
        type: GET_CONTEXT_LAYERS,
        mapContextualLayers
      });

      if (typeof contextualLayers !== 'undefined' && contextualLayers.length) {
        dispatch({
          type: GET_CONTEXT_LAYERS,
          mapContextualLayers
        });

        const { selectedMapContextualLayers } = getState().tool;

        if (
          typeof selectedMapContextualLayers !== 'undefined' &&
          selectedMapContextualLayers.length
        ) {
          dispatch({
            type: SELECT_CONTEXTUAL_LAYERS,
            contextualLayers: selectedMapContextualLayers
          });
        }
      }
    });
  };
}

// Get a list of selected node that are NOT part of the given column index
function getSelectedNodeIdsNotInColumnIndex(currentSelectedNodesIds, columnIndex, nodesDict) {
  return currentSelectedNodesIds.filter(nodeId => nodesDict[nodeId].columnGroup !== columnIndex);
}

// remove or add nodeId from selectedNodesIds
function getSelectedNodeIds(currentSelectedNodesIds, changedNodeId) {
  let selectedNodesIds;
  const nodeIndex = currentSelectedNodesIds.indexOf(changedNodeId);
  if (nodeIndex > -1) {
    selectedNodesIds = [].concat(currentSelectedNodesIds);
    selectedNodesIds.splice(nodeIndex, 1);
  } else {
    selectedNodesIds = [changedNodeId].concat(currentSelectedNodesIds);
  }
  return selectedNodesIds;
}

export function selectNode(param, isAggregated = false) {
  const ids = Array.isArray(param) ? param : [param];
  return (dispatch, getState) => {
    ids.forEach(nodeId => {
      if (isAggregated) {
        dispatch(setSankeySearchVisibility(true));
      } else {
        const currentSelectedNodesIds = getState().tool.selectedNodesIds;
        // we are unselecting the node that is currently expanded: just shrink it and bail
        if (
          getState().tool.areNodesExpanded &&
          currentSelectedNodesIds.length === 1 &&
          currentSelectedNodesIds.indexOf(nodeId) > -1
        ) {
          dispatch(toggleNodesExpand());
        }

        const selectedNodesIds = getSelectedNodeIds(currentSelectedNodesIds, nodeId);

        // send to state the new node selection along with new data, geoIds, etc
        dispatch(updateNodes(selectedNodesIds));

        // refilter links by selected nodes
        dispatch({
          type: FILTER_LINKS_BY_NODES
        });

        // load related geoIds to show on the map
        dispatch(loadLinkedGeoIDs());
      }
    });
  };
}

export function updateNodes(selectedNodesIds) {
  return (dispatch, getState) => {
    const action = getNodesSelectionAction(selectedNodesIds, getState().tool);
    action.type = UPDATE_NODE_SELECTION;
    dispatch(action);
  };
}

export function setSankeySearchVisibility(searchVisibility) {
  return dispatch =>
    dispatch({
      type: SET_SANKEY_SEARCH_VISIBILITY,
      searchVisibility
    });
}

export function selectNodeFromGeoId(geoId) {
  return (dispatch, getState) => {
    const nodeId = getNodeIdFromGeoId(
      geoId,
      getState().tool.nodesDict,
      getState().tool.selectedColumnsIds[0]
    );

    // node not in visible Nodes ---> expand node (same behavior as search)
    dispatch(selectExpandedNode(nodeId));
  };
}

export function selectExpandedNode(param) {
  const ids = Array.isArray(param) ? param : [param];
  return (dispatch, getState) => {
    ids.forEach(nodeId => {
      if (!_isNodeVisible(getState, nodeId)) {
        const { tool } = getState();
        if (tool.selectedNodesIds.length === 1 && tool.selectedNodesIds.includes(nodeId)) {
          dispatch(resetState());
        } else {
          const node = tool.nodesDict[nodeId];
          if (!node) {
            console.warn(`requested node ${nodeId} does not exist in nodesDict`);
            return;
          }

          // check if we need to swap column
          if (!isNodeColumnVisible(node, tool.selectedColumnsIds)) {
            dispatch(selectColumn(node.columnGroup, node.columnId, false));
          }

          const currentSelectedNodesIds = getState().tool.selectedNodesIds;
          const selectedNodesIds = getSelectedNodeIds(currentSelectedNodesIds, nodeId);
          dispatch(toggleNodesExpand(true, selectedNodesIds));
        }
      } else {
        dispatch(selectNode(nodeId, false));
      }
    });
  };
}

export function highlightNode(nodeId, isAggregated, coordinates) {
  return (dispatch, getState) => {
    if (isAggregated) {
      return;
    }

    const action = getNodesSelectionAction([nodeId], getState().tool);
    action.type = HIGHLIGHT_NODE;
    action.coordinates = coordinates;
    dispatch(action);
  };
}

export function highlightNodeFromGeoId(geoId, coordinates) {
  return (dispatch, getState) => {
    const nodeId = getNodeIdFromGeoId(
      geoId,
      getState().tool.nodesDict,
      getState().tool.selectedColumnsIds[0]
    );
    dispatch(highlightNode(nodeId, false, coordinates));
  };
}

export function toggleNodesExpand(forceExpand = false, forceExpandNodeIds) {
  return (dispatch, getState) => {
    dispatch({
      type: TOGGLE_NODES_EXPAND,
      forceExpand,
      forceExpandNodeIds
    });

    // if expanding, and if in detailed mode, toggle to overview mode
    if (getState().tool.areNodesExpanded === true && getState().tool.detailedView === true) {
      dispatch({
        type: SELECT_VIEW,
        detailedView: false,
        forcedOverview: true
      });
    } else if (
      getState().tool.areNodesExpanded === false &&
      getState().tool.forcedOverview === true
    ) {
      // if shrinking, and if overview was previously forced, go back to detailed
      dispatch({
        type: SELECT_VIEW,
        detailedView: true,
        forcedOverview: false
      });
    }

    dispatch(loadLinks());
  };
}

export function navigateToProfile(nodeId, year) {
  return (dispatch, getState) => {
    const node = getState().tool.nodesDict[nodeId];
    dispatch({
      type: `profile${capitalize(node.profileType)}`,
      payload: { query: { nodeId, year } }
    });
  };
}

export function loadLinkedGeoIDs() {
  return (dispatch, getState) => {
    const state = getState();
    const selectedNodesIds = state.tool.selectedNodesIds;

    // when selection only contains geo nodes (column 0), we should not call get_linked_geoids
    const selectedNodesColumnsPos = state.tool.selectedNodesColumnsPos;
    const selectedNonGeoNodeIds = selectedNodesIds.filter(
      (nodeId, index) => selectedNodesColumnsPos[index] !== 0
    );
    if (selectedNonGeoNodeIds.length === 0) {
      dispatch({
        type: GET_LINKED_GEOIDS,
        payload: []
      });
      return;
    }
    const params = {
      context_id: state.tool.selectedContextId,
      years: uniq([state.tool.selectedYears[0], state.tool.selectedYears[1]]),
      nodes_ids: selectedNodesIds,
      target_column_id: state.tool.selectedColumnsIds[0]
    };
    const url = getURLFromParams(GET_LINKED_GEO_IDS_URL, params);

    fetch(url)
      .then(res => res.text())
      .then(payload => {
        dispatch({
          type: GET_LINKED_GEOIDS,
          payload: JSON.parse(payload)
        });
      });
  };
}

export function saveMapView(latlng, zoom) {
  return {
    type: SAVE_MAP_VIEW,
    latlng,
    zoom
  };
}

export function toggleMapDimension(uid) {
  return (dispatch, getState) => {
    dispatch({
      type: TOGGLE_MAP_DIMENSION,
      uid
    });
    dispatch(updateNodes(getState().tool.selectedNodesIds));
  };
}

export function setMapDimensions(uids) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_MAP_DIMENSIONS,
      uids
    });
    dispatch(updateNodes(getState().tool.selectedNodesIds));
  };
}

export function selectContextualLayers(contextualLayers) {
  return {
    type: SELECT_CONTEXTUAL_LAYERS,
    contextualLayers
  };
}

export function selectMapBasemap(selectedMapBasemap) {
  return {
    type: SELECT_BASEMAP,
    selectedMapBasemap
  };
}

export function toggleMapSidebarGroup(id) {
  return {
    type: TOGGLE_MAP_SIDEBAR_GROUP,
    id: parseInt(id, 10)
  };
}

const _isNodeVisible = (getState, nodeId) =>
  getState()
    .tool.visibleNodes.map(node => node.id)
    .indexOf(nodeId) > -1;
