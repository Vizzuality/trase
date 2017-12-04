import actions from 'actions';
import * as topojson from 'topojson';
import _ from 'lodash';
import { NUM_NODES_SUMMARY,
  NUM_NODES_DETAILED,
  NUM_NODES_EXPANDED,
  CARTO_NAMED_MAPS_BASE_URL,
  CONTEXT_WITHOUT_MAP_IDS,
  YEARS_DISABLED_NO_AGGR,
  YEARS_DISABLED_UNAVAILABLE,
  CONTEXT_WITH_CONTEXT_LAYERS_IDS,
  CONTEXT_LAYERS
} from 'constants';
import {
  getURLFromParams,
  GET_ALL_NODES,
  GET_COLUMNS,
  GET_FLOWS,
  GET_NODE_ATTRIBUTES,
  GET_LINKED_GEO_IDS,
  GET_MAP_BASE_DATA,
  GET_CONTEXTS,
  GET_TOOLTIPS
} from 'utils/getURLFromParams';
import { contextLayersCarto } from './map/context_layers_carto';
import getNodeIdFromGeoId from './helpers/getNodeIdFromGeoId';
import getNodesSelectionAction from './helpers/getNodesSelectionAction';
import getSelectedNodesStillVisible from './helpers/getSelectedNodesStillVisible';
import setGeoJSONMeta from './helpers/setGeoJSONMeta';
import getNodeMetaUid from 'reducers/helpers/getNodeMetaUid';
import { getSingleMapDimensionWarning } from 'reducers/helpers/getMapDimensionsWarnings';
import getProfileLink from 'utils/getProfileLink';

export function resetState(refilter = true) {
  return (dispatch) => {
    dispatch({
      type: actions.RESET_SELECTION
    });
    if (refilter === true) {
      dispatch({
        type: actions.FILTER_LINKS_BY_NODES
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
  return _reloadLinks('biomeFilter', biomeFilter, actions.SELECT_BIOME_FILTER, reloadLinks);
}

export function selectResizeBy(resizeBy, reloadLinks) {
  return _reloadLinks('resizeBy', resizeBy, actions.SELECT_RESIZE_BY, reloadLinks);
}

export function selectRecolorBy(data) {
  return dispatch => {
    dispatch({
      type: actions.SELECT_RECOLOR_BY, value: data.value, value_type: data.type
    });
    dispatch(loadLinks());
  };
}
export function selectView(detailedView, reloadLinks) {
  return _reloadLinks('detailedView', detailedView, actions.SELECT_VIEW, reloadLinks);
}

export function selectColumn(columnIndex, columnId, reloadLinks = true) {
  return (dispatch, getState) => {
    const state = getState();

    // Action triggered but the column is already present - do nothing
    if (state.tool.selectedColumnsIds.indexOf(columnId) !== -1) {
      return;
    }

    dispatch({
      type: actions.SELECT_COLUMN, columnIndex, columnId
    });
    const selectedNodesIds = getSelectedNodeIdsNotInColumnIndex(state.tool.selectedNodesIds, columnIndex, state.tool.nodesDict);
    dispatch(updateNodes(selectedNodesIds));

    dispatch({
      type: actions.FILTER_LINKS_BY_NODES
    });

    if (reloadLinks) {
      dispatch(loadLinks());
    }
  };
}

export function selectYears(years) {
  return dispatch => {
    dispatch({
      type: actions.SELECT_YEARS, years
    });
    dispatch(loadNodes());
    dispatch(loadLinks());
  };
}

const _reloadLinks = (param, value, type, reloadLinks = true) => {
  return dispatch => {
    const action = {
      type
    };
    action[param] = value;
    dispatch(action);
    if (reloadLinks) {
      dispatch(loadLinks());
    }
  };
};

export function loadInitialData() {
  return (dispatch, getState) => {
    dispatch({
      type: actions.LOAD_INITIAL_DATA
    });

    const contextURL = getURLFromParams(GET_CONTEXTS);
    const tooltipsURL = getURLFromParams(GET_TOOLTIPS);

    Promise.all([contextURL, tooltipsURL].map(url => fetch(url)
      .then(resp => resp.text())))
      .then(data => {
        const tooltipsPayload = JSON.parse(data[1]);

        dispatch({
          type: actions.SET_TOOLTIPS,
          payload: tooltipsPayload
        });

        const contextPayload = JSON.parse(data[0]).data;
        // load contexts
        dispatch({
          type: actions.LOAD_CONTEXTS,
          payload: contextPayload
        });

        const state = getState();
        const defaultContextId = state.tool.selectedContextId || contextPayload.find(context => context.isDefault === true).id;

        dispatch(setContext(defaultContextId, true));
      });
  };
}

export function setContext(contextId, isInitialContextSet = false) {
  return dispatch => {

    // load default params
    dispatch({
      type: (isInitialContextSet ? actions.LOAD_INITIAL_CONTEXT : actions.SET_CONTEXT), payload: contextId
    });

    const params = {
      context_id: contextId
    };
    const allNodesURL = getURLFromParams(GET_ALL_NODES, params);
    const columnsURL = getURLFromParams(GET_COLUMNS, params);

    Promise.all([allNodesURL, columnsURL].map(url => fetch(url).then(resp => resp.text()))).then(payload => {
      // TODO do not wait for end of all promises/use another .all call
      dispatch({
        type: actions.GET_COLUMNS, payload: payload.slice(0, 2),
      });

      dispatch(loadLinks());

      if (CONTEXT_WITHOUT_MAP_IDS.indexOf(contextId) === -1) {
        dispatch(loadNodes());
        dispatch(loadMapVectorData());
        dispatch(loadMapContextLayers());
      } else {
        dispatch(resetContextLayers());
        dispatch(resetMapDimensions());
      }
    });
  };
}

export function loadNodes() {
  return (dispatch, getState) => {
    dispatch({
      type: actions.LOAD_NODES
    });
    const params = {
      context_id: getState().tool.selectedContextId,
      start_year: getState().tool.selectedYears[0],
      end_year: getState().tool.selectedYears[1],
    };

    const getNodesURL = getURLFromParams(GET_NODE_ATTRIBUTES, params);
    const getMapDimensionsMetadataURL = getURLFromParams(GET_MAP_BASE_DATA, params);
    const selectedMapDimensions = getState().tool.selectedMapDimensions;

    Promise.all([getNodesURL, getMapDimensionsMetadataURL].map(url => fetch(url).then(resp => resp.text()))).then(rawPayload => {
      const payload = {
        nodesJSON: JSON.parse(rawPayload[0]), mapDimensionsMetaJSON: JSON.parse(rawPayload[1])
      };

      const currentYearBoundaries = getState().tool.selectedYears;
      const allSelectedYears = [];
      for (var i = currentYearBoundaries[0]; i <= currentYearBoundaries[1]; i++) {
        allSelectedYears.push(i);
      }

      payload.mapDimensionsMetaJSON.dimensions.forEach(dimension => {
        if (/*(dimension.aggregateMethod === undefined || dimension.aggregateMethod === null) &&*/ allSelectedYears.length > 1) {
          dimension.disabledYearRangeReason = YEARS_DISABLED_NO_AGGR;
          dimension.disabledYearRangeReasonText = getSingleMapDimensionWarning(dimension.disabledYearRangeReason);
        } else {
          const allYearsCovered = dimension.years === null || allSelectedYears.every(year => dimension.years.indexOf(year) > -1);
          if (!allYearsCovered) {
            dimension.disabledYearRangeReason = YEARS_DISABLED_UNAVAILABLE;
            dimension.disabledYearRangeReasonText = getSingleMapDimensionWarning(dimension.disabledYearRangeReason);
          }
        }
      });

      dispatch({
        type: actions.GET_NODE_ATTRIBUTES, payload
      });
      
      // reselect biome filter to add biome geoid
      if (getState().tool.selectedBiomeFilter.nodeId !== undefined) {
        dispatch({
          type: actions.SELECT_BIOME_FILTER,
          biomeFilter: getState().tool.selectedBiomeFilter.name
        });
      }

      const allAvailableMapDimensionsUids = payload.mapDimensionsMetaJSON.dimensions.map(dimension => getNodeMetaUid(dimension.type, dimension.layerAttributeId));
      const selectedMapDimensionsSet = _.compact(selectedMapDimensions);

      // are all currently selected map dimensions available ?
      if (selectedMapDimensions !== undefined && (_.difference(selectedMapDimensionsSet, allAvailableMapDimensionsUids)).length === 0) {
        dispatch(setMapDimensions(selectedMapDimensions.concat([])));
      } else {
        // use default map dimensions
        const defaultMapDimensions = payload.mapDimensionsMetaJSON.dimensions.filter(dimension => dimension.isDefault);
        if (defaultMapDimensions !== undefined) {
          const uids = defaultMapDimensions.map(selectedDimension => getNodeMetaUid(selectedDimension.type, selectedDimension.layerAttributeId));
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
      type: actions.LOAD_LINKS
    });
    const state = getState();
    const params = {
      context_id: state.tool.selectedContextId,
      year_start: state.tool.selectedYears[0],
      year_end: state.tool.selectedYears[1],
      include_columns: state.tool.selectedColumnsIds.join(','),
      flow_quant: state.tool.selectedResizeBy.name
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

    const url = getURLFromParams(GET_FLOWS, params);

    fetch(url)
      .then((response) => {
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
            type: actions.SHOW_LINKS_ERROR
          });
          return;
        }

        dispatch({
          type: actions.GET_LINKS,
          jsonPayload
        });

        // reselect nodes ---> FILTER NODE IDS THAT ARE NOT VISIBLE ANYMORE + UPDATE DATA for titlebar
        const selectedNodesIds = getSelectedNodesStillVisible(getState().tool.visibleNodes, getState().tool.selectedNodesIds);

        dispatch(updateNodes(selectedNodesIds));

        if (getState().tool.selectedNodesIds && getState().tool.selectedNodesIds.length > 0) {
          dispatch({
            type: actions.FILTER_LINKS_BY_NODES
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
      const geometryData = {
        name: geoColumn.name, useGeometryFromColumnId: geoColumn.useGeometryFromColumnId
      };
      mapVectorData[geoColumn.id] = geometryData;
      if (geoColumn.useGeometryFromColumnId === undefined) {
        const vectorLayerURL = `vector_layers/${getState().tool.selectedContext.countryName}_${geoColumn.name}.topo.json`;
        const geometryPromise = fetch(vectorLayerURL)
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              return response.text();
            }
          })
          .then(payload => {
            if (payload === undefined) {
              console.warn('missing vector layer file', vectorLayerURL);
              return;
            }
            const topoJSON = JSON.parse(payload);
            const key = Object.keys(topoJSON.objects)[0];
            const geoJSON = topojson.feature(topoJSON, topoJSON.objects[key]);
            setGeoJSONMeta(geoJSON, getState().tool.nodesDict, getState().tool.geoIdsDict, geoColumn.id);
            mapVectorData[geoColumn.id].geoJSON = geoJSON;
          });
        geometriesPromises.push(geometryPromise);
      }
    });

    Promise.all(geometriesPromises).then(() => {
      Object.keys(mapVectorData).forEach(id => {
        mapVectorData[id].isPoint = mapVectorData[id].geoJSON && mapVectorData[id].geoJSON.features.length && mapVectorData[id].geoJSON.features[0].geometry.type === 'Point';
      });
      dispatch({
        type: actions.GET_MAP_VECTOR_DATA, mapVectorData
      });
    });
  };
}

export function resetContextLayers() {
  return (dispatch) => {
    dispatch({
      type: actions.GET_CONTEXT_LAYERS,
      mapContextualLayers: []
    });
    dispatch({
      type: actions.SELECT_CONTEXTUAL_LAYERS,
      contextualLayers: []
    });
  };
}

export function loadMapContextLayers() {
  return (dispatch, getState) => {
    const mapContextualLayers = CONTEXT_LAYERS.map(layer => {
      const contextLayer = Object.assign({}, layer);
      if (!layer.rasterURL) {
        const carto = contextLayersCarto[layer.id];
        contextLayer.cartoURL = `${CARTO_NAMED_MAPS_BASE_URL}${carto.uid}/jsonp?callback=cb`;
        contextLayer.layergroupid = carto.layergroupid;
      }
      return contextLayer;
    });

    // TODO add context layers data on the API side (on get_map_base_data)
    if (CONTEXT_WITH_CONTEXT_LAYERS_IDS.indexOf(getState().tool.selectedContext.id) === -1) {
      dispatch(resetContextLayers());
      return;
    }

    Promise.all(mapContextualLayers.filter(l => l.cartoURL !== null).map(l => fetch(l.cartoURL).then(resp => resp.text()))).then(() => {
      // we actually don't care about layergroupids because we already have them pregenerated
      // this is just about reinstanciating named maps, you know, because CARTO
      dispatch({
        type: actions.GET_CONTEXT_LAYERS, mapContextualLayers
      });

      const contextualLayers = getState().tool.selectedMapContextualLayers;

      if (contextualLayers !== undefined && contextualLayers.length) {
        dispatch({
          type: actions.SELECT_CONTEXTUAL_LAYERS,
          contextualLayers
        });
      }
    });

  };
}

// Get a list of selected node that are NOT part of the given column index
function getSelectedNodeIdsNotInColumnIndex(currentSelectedNodesIds, columnIndex, nodesDict) {
  const selectedNodesIds = currentSelectedNodesIds.filter(nodeId => {
    return nodesDict[nodeId].columnGroup !== columnIndex;
  });

  return selectedNodesIds;
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

export function selectNode(nodeId, isAggregated = false) {
  return (dispatch, getState) => {
    const { tool } = getState();
    if (isAggregated) {
      dispatch(selectView(true));
    } else if (tool.areNodesExpanded) {
      dispatch(selectExpandedNode(nodeId));
    } else {
      const currentSelectedNodesIds = tool.selectedNodesIds;
      const selectedNodesIds = getSelectedNodeIds(currentSelectedNodesIds, nodeId);

      // send to state the new node selection along with new data, geoIds, etc
      dispatch(updateNodes(selectedNodesIds));

      // refilter links by selected nodes
      dispatch({
        type: actions.FILTER_LINKS_BY_NODES
      });

      // load related geoIds to show on the map
      dispatch(loadLinkedGeoIDs());
    }
  };
}

export function updateNodes(selectedNodesIds) {
  return (dispatch, getState) => {
    const action = getNodesSelectionAction(selectedNodesIds, getState().tool);
    action.type = actions.UPDATE_NODE_SELECTION;
    dispatch(action);
  };
}

export function selectNodeFromGeoId(geoId) {
  return (dispatch, getState) => {
    const nodeId = getNodeIdFromGeoId(geoId, getState().tool.nodesDict, getState().tool.selectedColumnsIds[0]);

    // node not in visible Nodes ---> expand node (same behavior as search)
    dispatch(selectExpandedNode(nodeId));
  };
}

export function selectExpandedNode(nodeId) {
  return (dispatch, getState) => {
    const { tool } = getState();
    if (tool.selectedNodesIds.length === 1 && tool.selectedNodesIds.includes(nodeId)) {
      dispatch(resetState());
    } else {
      // check if we need to swap column
      const node = tool.nodesDict[nodeId];
      if (!node) {
        console.warn(`requested node ${nodeId} does not exist in nodesDict`);
        return;
      }

      const columnGroup = node.columnGroup;
      const currentColumnAtPos = tool.selectedColumnsIds[columnGroup];

      if (currentColumnAtPos !== node.columnId) {
        dispatch(selectColumn(columnGroup, node.columnId, false));
      }

      const currentSelectedNodesIds = getState().tool.selectedNodesIds;
      const selectedNodesIds = getSelectedNodeIds(currentSelectedNodesIds, nodeId);
      dispatch(toggleNodesExpand(true, selectedNodesIds));
    }
  };
}

export function highlightNode(nodeId, isAggregated, coordinates) {
  return (dispatch, getState) => {
    if (isAggregated) {
      return;
    }

    const action = getNodesSelectionAction([nodeId], getState().tool);
    action.type = actions.HIGHLIGHT_NODE;
    action.coordinates = coordinates;
    dispatch(action);
  };
}

export function highlightNodeFromGeoId(geoId, coordinates) {
  return (dispatch, getState) => {
    const nodeId = getNodeIdFromGeoId(geoId, getState().tool.nodesDict, getState().tool.selectedColumnsIds[0]);
    dispatch(highlightNode(nodeId, false, coordinates));
  };
}

export function toggleNodesExpand(forceExpand = false, forceExpandNodeIds) {
  return (dispatch, getState) => {
    dispatch({
      type: actions.TOGGLE_NODES_EXPAND, forceExpand, forceExpandNodeIds
    });

    // if expanding, and if in detailed mode, toggle to overview mode
    if (getState().tool.areNodesExpanded === true && getState().tool.detailedView === true) {
      dispatch({
        type: actions.SELECT_VIEW, detailedView: false, forcedOverview: true
      });
    }

    // if shrinking, and if overview was previously forced, go back to detailed
    else if (getState().tool.areNodesExpanded === false && getState().tool.forcedOverview === true) {
      dispatch({
        type: actions.SELECT_VIEW, detailedView: true, forcedOverview: false
      });
    }

    dispatch(loadLinks());
  };
}

export function navigateToProfile(nodeId) {
  return (dispatch, getState) => {
    const url = getProfileLink(getState().tool.nodesDict[nodeId]);
    window.location.href = url;
  };
}

export function loadLinkedGeoIDs() {
  return (dispatch, getState) => {
    const state = getState();
    const selectedNodesIds = state.tool.selectedNodesIds;

    // when selection only contains geo nodes (column 0), we should not call get_linked_geoids
    const selectedNodesColumnsPos = state.tool.selectedNodesColumnsPos;
    const selectedNonGeoNodeIds = selectedNodesIds.filter((nodeId, index) => {
      return selectedNodesColumnsPos[index] !== 0;
    });
    if (selectedNonGeoNodeIds.length === 0) {
      dispatch({
        type: actions.GET_LINKED_GEOIDS, payload: []
      });
      return;
    }
    const params = {
      context_id: state.tool.selectedContextId,
      years: _.uniq([state.tool.selectedYears[0], state.tool.selectedYears[1]]),
      node_id: selectedNodesIds,
      target_column_id: state.tool.selectedColumnsIds[0]
    };
    const url = getURLFromParams(GET_LINKED_GEO_IDS, params);

    fetch(url)
      .then(res => res.text())
      .then(payload => {
        dispatch({
          type: actions.GET_LINKED_GEOIDS, payload: JSON.parse(payload)
        });
      });
  };
}

export function saveMapView(latlng, zoom) {
  return {
    type: actions.SAVE_MAP_VIEW,
    latlng,
    zoom
  };
}

export function toggleMapDimension(uid) {
  return (dispatch, getState) => {
    dispatch({
      type: actions.TOGGLE_MAP_DIMENSION,
      uid
    });
    dispatch(updateNodes(getState().tool.selectedNodesIds));
  };
}

export function setMapDimensions(uids) {
  return (dispatch, getState) => {
    dispatch({
      type: actions.SET_MAP_DIMENSIONS,
      uids
    });
    dispatch(updateNodes(getState().tool.selectedNodesIds));
  };
}

export function resetMapDimensions() {
  return {
    type: actions.RESET_MAP_DIMENSIONS
  };
}

export function selectContextualLayers(contextualLayers) {
  return {
    type: actions.SELECT_CONTEXTUAL_LAYERS,
    contextualLayers
  };
}

export function selectMapBasemap(selectedMapBasemap) {
  return {
    type: actions.SELECT_BASEMAP,
    selectedMapBasemap
  };
}

export function toggleMapSidebarGroup(id) {
  return {
    type: actions.TOGGLE_MAP_SIDEBAR_GROUP,
    id
  };
}

// const _isNodeVisible = (getState, nodeId) => getState().tool.visibleNodes.map(node => node.id).indexOf(nodeId) > -1;
