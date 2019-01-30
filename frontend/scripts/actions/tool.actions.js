/* eslint-disable no-use-before-define */
import { feature as topojsonFeature } from 'topojson';
import {
  CARTO_NAMED_MAPS_BASE_URL,
  NUM_NODES_DETAILED,
  NUM_NODES_EXPANDED,
  NUM_NODES_SUMMARY,
  YEARS_INCOMPLETE,
  YEARS_DISABLED_UNAVAILABLE
} from 'constants';
import {
  GET_ALL_NODES_URL,
  GET_COLUMNS_URL,
  GET_FLOWS_URL,
  GET_LINKED_GEO_IDS_URL,
  GET_MAP_BASE_DATA_URL,
  GET_NODE_ATTRIBUTES_URL,
  getURLFromParams
} from 'utils/getURLFromParams';
import contextLayersCarto from 'named-maps/tool_named_maps_carto';
import getNodeIdFromGeoId from 'actions/helpers/getNodeIdFromGeoId';
import setGeoJSONMeta from 'actions/helpers/setGeoJSONMeta';
import getNodeMetaUid from 'reducers/helpers/getNodeMetaUid';
import { getSingleMapDimensionWarning } from 'reducers/helpers/getMapDimensionsWarnings';
import isNodeColumnVisible from 'utils/isNodeColumnVisible';
import difference from 'lodash/difference';
import intesection from 'lodash/intersection';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import xor from 'lodash/xor';
import { getCurrentContext } from 'reducers/helpers/contextHelper';
import { getSelectedNodesColumnsPos } from 'react-components/tool/tool.selectors';
import pSettle from 'p-settle';

export const RESET_SELECTION = 'RESET_SELECTION';
export const GET_COLUMNS = 'GET_COLUMNS';
export const RESET_TOOL_LOADERS = 'RESET_TOOL_LOADERS';
export const SET_FLOWS_LOADING_STATE = 'SET_FLOWS_LOADING_STATE';
export const SET_MAP_LOADING_STATE = 'SET_MAP_LOADING_STATE';
export const GET_LINKS = 'GET_LINKS';
export const SET_NODE_ATTRIBUTES = 'SET_NODE_ATTRIBUTES';
export const SET_MAP_DIMENSIONS_DATA = 'SET_MAP_DIMENSIONS_DATA';
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
export const SET_MAP_DIMENSIONS_SELECTION = 'SET_MAP_DIMENSIONS_SELECTION';
export const TOGGLE_MAP_DIMENSION = 'TOGGLE_MAP_DIMENSION';
export const SELECT_CONTEXTUAL_LAYERS = 'SELECT_CONTEXTUAL_LAYERS';
export const SELECT_BASEMAP = 'SELECT_BASEMAP';
export const TOGGLE_MAP = 'TOGGLE_MAP';
export const EXPAND_NODE_SELECTION = 'EXPAND_NODE_SELECTION';
export const COLLAPSE_NODE_SELECTION = 'COLLAPSE_NODE_SELECTION';
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

const _setRecolorByAction = (recolorBy, state) => {
  let selectedRecolorBy;
  if (recolorBy.value === 'none') {
    selectedRecolorBy = { type: 'none', name: 'none' };
  } else {
    const currentContext = getCurrentContext(state);
    selectedRecolorBy = currentContext.recolorBy.find(
      contextRecolorBy => contextRecolorBy.name === recolorBy.name
    );
  }

  return {
    type: SELECT_RECOLOR_BY,
    payload: selectedRecolorBy
  };
};

const _setResizeByAction = (resizeByName, state) => {
  let selectedResizeBy;
  if (resizeByName === 'none') {
    selectedResizeBy = { name: 'none' };
  } else {
    const currentContext = getCurrentContext(state);
    selectedResizeBy = currentContext.resizeBy.find(
      contextResizeBy => contextResizeBy.name === resizeByName
    );
  }

  return {
    type: SELECT_RESIZE_BY,
    payload: selectedResizeBy
  };
};

const _setBiomeFilterAction = (biomeFilterName, state) => {
  let selectedBiomeFilter;
  if (biomeFilterName === 'none') {
    selectedBiomeFilter = { value: 'none', name: 'none' };
  } else {
    const currentContext = getCurrentContext(state);
    selectedBiomeFilter = Object.assign(
      {},
      currentContext.filterBy[0].nodes.find(filterBy => filterBy.name === biomeFilterName)
    );
    selectedBiomeFilter.geoId = state.tool.nodesDict[selectedBiomeFilter.nodeId].geoId;
  }

  return {
    type: SELECT_BIOME_FILTER,
    payload: selectedBiomeFilter
  };
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

// Resets sankey's params that may lead to no flows being returned from the API
export function resetSankey() {
  return (dispatch, getState) => {
    const { columns, expandedNodesIds } = getState().tool;
    const { contexts, selectedContext } = getState().app;
    const areNodesExpanded = !isEmpty(expandedNodesIds);
    const currentContext = contexts.find(context => context.id === selectedContext.id);
    const defaultColumns = columns.filter(column => column.isDefault);
    const defaultResizeBy =
      currentContext && currentContext.resizeBy.find(resizeBy => resizeBy.isDefault);
    const defaultRecolorBy =
      currentContext && currentContext.recolorBy.find(recolorBy => recolorBy.isDefault);

    dispatch({
      type: SELECT_YEARS,
      years: [currentContext.defaultYear, currentContext.defaultYear]
    });

    defaultColumns.forEach(defaultColumn => {
      dispatch({
        type: SELECT_COLUMN,
        columnIndex: defaultColumn.group,
        columnId: defaultColumn.id
      });
    });

    if (areNodesExpanded) {
      dispatch(collapseNodeSelection());
    }

    dispatch({
      type: SELECT_VIEW,
      detailedView: false,
      forcedOverview: true
    });

    const state = getState();

    if (defaultRecolorBy) {
      dispatch(_setRecolorByAction({ value: defaultRecolorBy[0].name }, state));
    } else {
      dispatch(_setRecolorByAction({ value: 'none' }, state));
    }

    dispatch(_setResizeByAction(defaultResizeBy.name, state));

    dispatch({
      type: RESET_SELECTION
    });
    dispatch({
      type: FILTER_LINKS_BY_NODES
    });

    dispatch(loadLinks());
  };
}

export function selectBiomeFilter(biomeFilter) {
  return (dispatch, getState) => {
    dispatch(_setBiomeFilterAction(biomeFilter, getState()));
    dispatch(loadLinks());
  };
}

export function selectResizeBy(resizeByName) {
  return (dispatch, getState) => {
    dispatch(_setResizeByAction(resizeByName, getState()));
    dispatch(loadLinks());
  };
}

export function selectRecolorBy(recolorBy) {
  return (dispatch, getState) => {
    dispatch(_setRecolorByAction(recolorBy, getState()));
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

    const selectedColumn = state.tool.columns.find(c => c.id === columnId);
    if (selectedColumn && selectedColumn.group === 0 && selectedColumn.isChoroplethDisabled) {
      dispatch(setMapDimensions([null, null]));
      state.tool.expandedMapSidebarGroupsIds.forEach(id => dispatch(toggleMapSidebarGroup(id)));
    }

    dispatch({
      type: FILTER_LINKS_BY_NODES
    });

    if (reloadLinks) {
      dispatch(loadLinks());
    }
  };
}

export function loadToolDataForCurrentContext() {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.app.selectedContext) {
      return;
    }

    const params = {
      context_id: state.app.selectedContext.id
    };
    const allNodesURL = getURLFromParams(GET_ALL_NODES_URL, params);
    const columnsURL = getURLFromParams(GET_COLUMNS_URL, params);
    const promises = [allNodesURL, columnsURL].map(url => fetch(url).then(resp => resp.json()));

    Promise.all(promises).then(payload => {
      // TODO do not wait for end of all promises/use another .all call
      dispatch({
        type: GET_COLUMNS,
        payload
      });

      dispatch(loadLinks());
      dispatch(loadNodes());
      dispatch(loadMapVectorData());
    });
  };
}

export function loadNodes() {
  return (dispatch, getState) => {
    const params = {
      context_id: getState().app.selectedContext.id,
      start_year: getState().app.selectedYears[0],
      end_year: getState().app.selectedYears[1]
    };

    const getMapBaseDataURL = getURLFromParams(GET_MAP_BASE_DATA_URL, params);
    const selectedMapDimensions = getState().tool.selectedMapDimensions;

    fetch(getMapBaseDataURL)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(new Error(response.statusText));
      })
      .then(jsonPayload => {
        const payload = {
          mapDimensionsMetaJSON: jsonPayload
        };

        const [startYear, endYear] = getState().app.selectedYears;
        const allSelectedYears = Array(endYear - startYear + 1)
          .fill(startYear)
          .map((year, index) => year + index);

        payload.mapDimensionsMetaJSON.dimensions.forEach(dimension => {
          const allYearsCovered =
            dimension.years === null ||
            dimension.years.length === 0 ||
            allSelectedYears.every(year => dimension.years.includes(year));
          const yearsWithDataToDisplay = intesection(dimension.years, allSelectedYears);
          if (
            !allYearsCovered &&
            allSelectedYears.length > 1 &&
            yearsWithDataToDisplay.length > 0
          ) {
            dimension.disabledYearRangeReason = YEARS_INCOMPLETE;
            dimension.disabledYearRangeReasonText = getSingleMapDimensionWarning(
              dimension.disabledYearRangeReason,
              yearsWithDataToDisplay,
              dimension.years
            );
          } else if (!allYearsCovered) {
            dimension.disabledYearRangeReason = YEARS_DISABLED_UNAVAILABLE;
            dimension.disabledYearRangeReasonText = getSingleMapDimensionWarning(
              dimension.disabledYearRangeReason,
              yearsWithDataToDisplay,
              dimension.years
            );
          }
        });

        dispatch(setMapContextLayers(payload.mapDimensionsMetaJSON.contextualLayers));

        dispatch({
          type: SET_MAP_DIMENSIONS_DATA,
          payload
        });

        const selectedBiomeFilter = getState().tool.selectedBiomeFilter;
        if (selectedBiomeFilter && selectedBiomeFilter.nodeId) {
          dispatch(_setBiomeFilterAction(selectedBiomeFilter.name, getState()));
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
    const state = getState();
    dispatch({
      type: SET_FLOWS_LOADING_STATE,
      payload: { loadedFlowsContextId: state.app.selectedContext.id }
    });
    const params = {
      context_id: state.app.selectedContext.id,
      start_year: state.app.selectedYears[0],
      end_year: state.app.selectedYears[1],
      include_columns: state.tool.selectedColumnsIds.join(','),
      flow_quant: state.tool.selectedResizeBy.name,
      locked_nodes: state.tool.selectedNodesIds
    };
    const areNodesExpanded = !isEmpty(state.tool.expandedNodesIds);

    if (state.tool.detailedView === true) {
      params.n_nodes = NUM_NODES_DETAILED;
    } else if (areNodesExpanded) {
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
    if (selectedBiomeFilter && selectedBiomeFilter.name && selectedBiomeFilter.name !== 'none') {
      params.biome_filter_id = selectedBiomeFilter.nodeId;
    }

    if (areNodesExpanded) {
      params.selected_nodes = state.tool.expandedNodesIds.join(',');
    }

    const url = getURLFromParams(GET_FLOWS_URL, params);

    fetch(url)
      .then(response => {
        if (response.status === 404) {
          return null;
        }
        return response.json();
      })
      .then(jsonPayload => {
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

        // if nodes were expanded and some of expanded nodes are not present anymore
        // re-expand nodes
        if (
          !isEmpty(difference(getState().tool.expandedNodesIds, getState().tool.selectedNodesIds))
        ) {
          dispatch(expandNodeSelection());
        }

        if (!isEmpty(getState().tool.selectedNodesIds)) {
          dispatch({
            type: FILTER_LINKS_BY_NODES
          });
        }

        // load related geoIds to show on the map
        dispatch(loadLinkedGeoIDs());
      })
      .catch(console.error);
  };
}

export function loadMapVectorData() {
  return (dispatch, getState) => {
    const geoColumns = getState().tool.columns.filter(column => column.isGeo === true);

    const vectorMaps = geoColumns.map(geoColumn => {
      const vectorData = {
        id: geoColumn.id,
        name: geoColumn.name,
        useGeometryFromColumnId: geoColumn.useGeometryFromColumnId
      };
      if (geoColumn.useGeometryFromColumnId === undefined) {
        const countryName = getState().app.selectedContext.countryName;
        const vectorLayerURL = `vector_layers/${countryName}_${geoColumn.name.replace(
          / /g,
          '_'
        )}.topo.json`;
        return fetch(vectorLayerURL)
          .then(res => res.json())
          .then(topoJSON => {
            const key = Object.keys(topoJSON.objects)[0];
            const geoJSON = topojsonFeature(topoJSON, topoJSON.objects[key]);
            setGeoJSONMeta(
              geoJSON,
              getState().tool.nodesDict,
              getState().tool.geoIdsDict,
              geoColumn.id
            );
            return {
              geoJSON,
              ...vectorData
            };
          })
          .catch(() => Promise.reject(vectorLayerURL));
      }
      return Promise.resolve(vectorData);
    });

    pSettle(vectorMaps).then(results => {
      const mapVectorData = results
        .map(res => {
          if (res.isFulfilled && !res.isRejected) {
            return {
              ...res.value,
              isPoint:
                !!res.value.geoJSON &&
                !!res.value.geoJSON.features.length &&
                res.value.geoJSON.features[0].geometry.type === 'Point'
            };
          }
          console.warn('missing vector layer file', res.reason);
          return null;
        })
        .filter(item => item !== null);
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
      if (!NAMED_MAPS_ENV || !contextLayersCarto[NAMED_MAPS_ENV]) {
        console.error('Invalid or missing NAMED_MAPS_ENV is preventing contextual layer loading.');
        return {};
      }
      const cartoIds = contextLayersCarto[NAMED_MAPS_ENV][layer.identifier];
      // TODO: implement multi-year support
      const cartoData = layer.cartoLayers[0];
      if (!cartoData.rasterUrl && cartoIds) {
        contextLayer.cartoURL = `${CARTO_NAMED_MAPS_BASE_URL}${cartoIds.uid}/jsonp?callback=cb`;
        contextLayer.layergroupid = cartoIds.layergroupid;
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

// remove or add nodeIds from selectedNodesIds
function getSelectedNodeIds(currentSelectedNodesIds, changedNodeIds) {
  return xor(currentSelectedNodesIds, changedNodeIds);
}

export function selectNode(param, isAggregated = false) {
  const ids = Array.isArray(param) ? param : [param];
  return (dispatch, getState) => {
    ids.forEach(nodeId => {
      const { selectedNodesIds: currentSelectedNodesIds, expandedNodesIds } = getState().tool;
      const areNodesExpanded = !isEmpty(expandedNodesIds);

      if (isAggregated) {
        dispatch(setSankeySearchVisibility(true));
      } else {
        // we are unselecting the node that is currently expanded: just shrink it and bail
        if (
          areNodesExpanded &&
          currentSelectedNodesIds.length === 1 &&
          currentSelectedNodesIds.indexOf(nodeId) > -1
        ) {
          dispatch(collapseNodeSelection());
        }

        const selectedNodesIds = getSelectedNodeIds(currentSelectedNodesIds, [nodeId]);

        // send to state the new node selection
        dispatch(updateNodes(selectedNodesIds));

        // refilter links by selected nodes
        dispatch({
          type: FILTER_LINKS_BY_NODES
        });
      }
    });
    if (!isAggregated) {
      // load related geoIds to show on the map
      return dispatch(loadLinkedGeoIDs());
    }
    return undefined;
  };
}

export function updateNodes(selectedNodesIds) {
  return dispatch => {
    dispatch({
      type: UPDATE_NODE_SELECTION,
      ids: selectedNodesIds
    });
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
    if (nodeId !== null) {
      dispatch(selectExpandedNode(nodeId));
    }
  };
}

export function selectExpandedNode(param) {
  const ids = Array.isArray(param) ? param : [param];
  return (dispatch, getState) => {
    const hasInvisibleNodes = ids.some(elem => !_isNodeVisible(getState, elem));

    if (hasInvisibleNodes) {
      const { tool } = getState();
      if (
        tool.selectedNodesIds.length === ids.length &&
        intesection(tool.selectedNodesIds, ids).length === ids.length
      ) {
        dispatch(resetState());
      } else {
        const nodes = ids.map(nodeId => {
          if (!tool.nodesDict[nodeId]) {
            console.warn(`requested node ${nodeId} does not exist in nodesDict`);
          }
          return tool.nodesDict[nodeId];
        });

        nodes.forEach(node => {
          if (!isNodeColumnVisible(node, tool.selectedColumnsIds)) {
            dispatch(selectColumn(node.columnGroup, node.columnId, false));
          }
        });

        const currentSelectedNodesIds = getState().tool.selectedNodesIds;
        const selectedNodesIds = getSelectedNodeIds(currentSelectedNodesIds, ids);

        dispatch(updateNodes(selectedNodesIds));
        dispatch(expandNodeSelection());
      }
    } else {
      dispatch(selectNode(ids, false));
    }
  };
}

export function highlightNode(nodeId, isAggregated, coordinates) {
  return dispatch => {
    if (isAggregated) {
      return;
    }

    dispatch({
      ids: compact([nodeId]),
      type: HIGHLIGHT_NODE,
      coordinates
    });
  };
}

export function highlightNodeFromGeoId(geoId, coordinates) {
  return (dispatch, getState) => {
    const { nodesDict, selectedColumnsIds, highlightedNodesIds } = getState().tool;

    const nodeId = getNodeIdFromGeoId(geoId, nodesDict, selectedColumnsIds[0]);
    if (nodeId === null) {
      if (highlightedNodesIds.length) {
        dispatch(highlightNode(null));
      }
    } else {
      dispatch(highlightNode(nodeId, false, coordinates));
    }
  };
}

export function expandNodeSelection() {
  return (dispatch, getState) => {
    dispatch({
      type: EXPAND_NODE_SELECTION
    });

    const { detailedView } = getState().tool;

    // if expanding, and if in detailed mode, toggle to overview mode
    if (detailedView) {
      dispatch({
        type: SELECT_VIEW,
        detailedView: false,
        forcedOverview: true
      });
    }

    dispatch(loadLinks());
  };
}

export function collapseNodeSelection() {
  return (dispatch, getState) => {
    dispatch({
      type: COLLAPSE_NODE_SELECTION
    });

    const { forcedOverview } = getState().tool;

    // if shrinking, and if overview was previously forced, go back to detailed
    if (forcedOverview) {
      dispatch({
        type: SELECT_VIEW,
        detailedView: true,
        forcedOverview: false
      });
    }

    dispatch(loadLinks());
  };
}

export function navigateToProfile(nodeId, year, contextId) {
  return (dispatch, getState) => {
    const node = getState().tool.nodesDict[nodeId];
    dispatch({
      type: 'profileNode',
      payload: { query: { nodeId, year, contextId }, profileType: node.profileType }
    });
  };
}

export function loadLinkedGeoIDs() {
  return (dispatch, getState) => {
    const state = getState();
    const selectedNodesIds = state.tool.selectedNodesIds;

    // when selection only contains geo nodes (column 0), we should not call get_linked_geoids
    const selectedNodesColumnsPos = getSelectedNodesColumnsPos(state.tool);
    const selectedNonGeoNodeIds = selectedNodesIds.filter(
      (nodeId, index) => selectedNodesColumnsPos[index] !== 0
    );
    if (selectedNonGeoNodeIds.length === 0) {
      dispatch({
        type: GET_LINKED_GEOIDS,
        payload: []
      });
      return undefined;
    }
    const params = {
      context_id: state.app.selectedContext.id,
      years: uniq([state.app.selectedYears[0], state.app.selectedYears[1]]),
      nodes_ids: selectedNodesIds,
      target_column_id: state.tool.selectedColumnsIds[0]
    };
    const url = getURLFromParams(GET_LINKED_GEO_IDS_URL, params);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status >= 200 && xhr.status < 400) {
        dispatch({
          type: GET_LINKED_GEOIDS,
          payload: JSON.parse(xhr.response)
        });
      }
    };

    xhr.send();
    return xhr;
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
    const { selectedYears } = getState().app;
    dispatch({
      type: TOGGLE_MAP_DIMENSION,
      payload: {
        uid,
        selectedYears
      }
    });

    loadMapChoropeth(getState, dispatch);
  };
}

export function setMapDimensions(uids) {
  return (dispatch, getState) => {
    const selectedYears = getState().app.selectedYears;
    dispatch({
      type: SET_MAP_DIMENSIONS_SELECTION,
      payload: {
        uids,
        selectedYears
      }
    });

    loadMapChoropeth(getState, dispatch);
  };
}

export function loadMapChoropeth(getState, dispatch) {
  const state = getState();

  const uids = state.tool.selectedMapDimensions;

  if (compact(uids).length === 0) {
    dispatch({
      type: SET_NODE_ATTRIBUTES
    });

    return;
  }

  const selectedMapDimensions = compact(uids).map(uid =>
    state.tool.mapDimensions.find(dimension => dimension.uid === uid)
  );

  const params = {
    context_id: state.app.selectedContext.id,
    start_year: state.app.selectedYears[0],
    end_year: state.app.selectedYears[1],
    layer_ids: selectedMapDimensions.map(layer => layer.id)
  };

  const getNodesURL = getURLFromParams(GET_NODE_ATTRIBUTES_URL, params);

  fetch(getNodesURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(new Error(response.statusText));
    })
    .then(payload => {
      dispatch({
        type: SET_NODE_ATTRIBUTES,
        payload
      });
    });
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
