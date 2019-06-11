/* eslint-disable no-use-before-define */
import { feature as topojsonFeature } from 'topojson';
import { CARTO_NAMED_MAPS_BASE_URL, YEARS_INCOMPLETE, YEARS_DISABLED_UNAVAILABLE } from 'constants';
import {
  GET_LINKED_GEO_IDS_URL,
  GET_MAP_BASE_DATA_URL,
  GET_NODE_ATTRIBUTES_URL,
  getURLFromParams
} from 'utils/getURLFromParams';
import contextLayersCarto from 'named-maps/tool_named_maps_carto';
import getNodeIdFromGeoId from 'actions/helpers/getNodeIdFromGeoId';
import setGeoJSONMeta from 'actions/helpers/setGeoJSONMeta';
import { getSingleMapDimensionWarning } from 'reducers/helpers/getMapDimensionsWarnings';
import intesection from 'lodash/intersection';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import xor from 'lodash/xor';
import {
  getSelectedColumnsIds,
  getSelectedMapDimensionsUids,
  getSelectedNodesColumnsPos
} from 'react-components/tool/tool.selectors';
import pSettle from 'p-settle';

import {
  setIsSearchOpen,
  selectView,
  collapseSankey,
  expandSankey,
  selectColumn
} from 'react-components/tool-links/tool-links.actions';

export const RESET_SELECTION = 'RESET_SELECTION';
export const SET_MAP_LOADING_STATE = 'SET_MAP_LOADING_STATE';
export const SET_NODE_ATTRIBUTES = 'SET_NODE_ATTRIBUTES';
export const SET_MAP_DIMENSIONS_DATA = 'SET_MAP_DIMENSIONS_DATA';
export const UPDATE_NODE_SELECTION = 'UPDATE_NODE_SELECTION';
export const HIGHLIGHT_NODE = 'HIGHLIGHT_NODE';
export const SELECT_BIOME_FILTER = 'SELECT_BIOME_FILTER';
export const SELECT_YEARS = 'SELECT_YEARS';
export const SELECT_RESIZE_BY = 'SELECT_RESIZE_BY';
export const SELECT_RECOLOR_BY = 'SELECT_RECOLOR_BY';
export const GET_MAP_VECTOR_DATA = 'GET_MAP_VECTOR_DATA';
export const GET_CONTEXT_LAYERS = 'GET_CONTEXT_LAYERS';
export const TOGGLE_MAP_DIMENSION = 'TOGGLE_MAP_DIMENSION';
export const SELECT_CONTEXTUAL_LAYERS = 'SELECT_CONTEXTUAL_LAYERS';
export const SELECT_BASEMAP = 'SELECT_BASEMAP';
export const TOGGLE_MAP = 'TOGGLE_MAP';
export const GET_LINKED_GEOIDS = 'GET_LINKED_GEOIDS';
export const SAVE_MAP_VIEW = 'SAVE_MAP_VIEW';
export const SHOW_LINKS_ERROR = 'SHOW_LINKS_ERROR';
export const RESET_TOOL_STATE = 'RESET_TOOL_STATE';

const _setRecolorByAction = (recolorBy, state) => {
  let selectedRecolorBy;
  if (recolorBy.value === 'none') {
    selectedRecolorBy = null;
  } else {
    const { selectedContext } = state.app;
    selectedRecolorBy = selectedContext.recolorBy.find(
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
    const { selectedContext } = state.app;
    selectedResizeBy = selectedContext.resizeBy.find(
      contextResizeBy => contextResizeBy.name === resizeByName
    );
  }

  return {
    type: SELECT_RESIZE_BY,
    payload: selectedResizeBy
  };
};

export function resetState() {
  return dispatch => {
    dispatch({
      type: RESET_SELECTION
    });
    dispatch(selectView(false));
  };
}

// TODO: test to see when this is needed.
// Resets sankey's params that may lead to no flows being returned from the API
export function resetSankey() {
  return (dispatch, getState) => {
    const state = getState();
    const { columns, expandedNodesIds } = state.toolLinks;
    const { contexts, selectedContext } = state.app;
    const areNodesExpanded = !isEmpty(expandedNodesIds);
    const currentContext = contexts.find(context => context.id === selectedContext.id);
    const defaultColumns = columns ? Object.values(columns).filter(column => column.isDefault) : [];
    const defaultResizeBy =
      currentContext && currentContext.resizeBy.find(resizeBy => resizeBy.isDefault);
    const defaultRecolorBy =
      currentContext && currentContext.recolorBy.find(recolorBy => recolorBy.isDefault);

    dispatch({
      type: SELECT_YEARS,
      years: [currentContext.defaultYear, currentContext.defaultYear]
    });

    defaultColumns.forEach(defaultColumn => {
      dispatch(selectColumn(defaultColumn.group, defaultColumn.id));
    });

    if (areNodesExpanded) {
      dispatch(collapseSankey());
    }

    dispatch(selectView(false, true));

    if (defaultRecolorBy) {
      dispatch(_setRecolorByAction({ value: defaultRecolorBy[0].name }, state));
    } else {
      dispatch(_setRecolorByAction({ value: 'none' }, state));
    }

    dispatch(_setResizeByAction(defaultResizeBy.name, state));

    dispatch({
      type: RESET_SELECTION
    });
  };
}

export function selectBiomeFilter(biomeFilterName) {
  return (dispatch, getState) => {
    let selectedBiomeFilter;
    if (biomeFilterName === 'none') {
      selectedBiomeFilter = { value: 'none', name: 'none' };
    } else {
      const {
        app: { selectedContext },
        toolLinks
      } = getState();
      selectedBiomeFilter = Object.assign(
        {},
        selectedContext.filterBy[0].nodes.find(filterBy => filterBy.name === biomeFilterName)
      );
      const node = toolLinks.data.nodes[selectedBiomeFilter.nodeId];
      selectedBiomeFilter.geoId = node && node.geoId;
    }

    dispatch({
      type: SELECT_BIOME_FILTER,
      payload: selectedBiomeFilter
    });
  };
}

export function selectResizeBy(resizeByName) {
  return (dispatch, getState) => {
    let selectedResizeBy;
    if (resizeByName === 'none') {
      selectedResizeBy = { name: 'none' };
    } else {
      const { selectedContext } = getState().app;
      selectedResizeBy = selectedContext.resizeBy.find(
        contextResizeBy => contextResizeBy.name === resizeByName
      );
    }

    dispatch({
      type: SELECT_RESIZE_BY,
      payload: selectedResizeBy
    });
  };
}

export function selectRecolorBy(recolorBy) {
  return (dispatch, getState) => {
    let selectedRecolorBy;
    if (recolorBy.value === 'none') {
      selectedRecolorBy = null;
    } else {
      const { selectedContext } = getState().app;
      selectedRecolorBy = selectedContext.recolorBy.find(
        contextRecolorBy => contextRecolorBy.name === recolorBy.name
      );
    }

    dispatch({
      type: SELECT_RECOLOR_BY,
      payload: selectedRecolorBy
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

        dispatch({ type: SET_MAP_DIMENSIONS_DATA, payload });

        loadMapChoropleth(getState, dispatch);
      });
  };
}

export function loadMapVectorData() {
  return (dispatch, getState) => {
    const { columns } = getState().toolLinks.data;
    const geoColumns = columns
      ? Object.values(columns).filter(column => column.isGeo === true)
      : [];

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
              getState().toolLinks.data.nodes,
              getState().toolLinks.data.nodesByColumnGeoId,
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
      loadMapChoropleth(getState, dispatch);
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

        const { selectedMapContextualLayers } = getState().toolLayers;

        if (selectedMapContextualLayers && selectedMapContextualLayers.length) {
          dispatch({
            type: SELECT_CONTEXTUAL_LAYERS,
            contextualLayers: selectedMapContextualLayers
          });
        }
      }
    });
  };
}

// remove or add nodeIds from selectedNodesIds
function getSelectedNodeIds(currentSelectedNodesIds, changedNodeIds) {
  return xor(currentSelectedNodesIds, changedNodeIds);
}

export function selectNode(param, isAggregated = false) {
  const ids = Array.isArray(param) ? param : [param];
  return (dispatch, getState) => {
    ids.forEach(nodeId => {
      const { selectedNodesIds: currentSelectedNodesIds, expandedNodesIds } = getState().toolLinks;
      const areNodesExpanded = !isEmpty(expandedNodesIds);

      if (isAggregated) {
        dispatch(setIsSearchOpen(true));
      } else {
        // we are unselecting the node that is currently expanded: just shrink it and bail
        if (
          areNodesExpanded &&
          currentSelectedNodesIds.length === 1 &&
          currentSelectedNodesIds.indexOf(nodeId) > -1
        ) {
          dispatch(collapseSankey());
        }

        const selectedNodesIds = getSelectedNodeIds(currentSelectedNodesIds, [nodeId]);

        // send to state the new node selection
        dispatch(updateNodes(selectedNodesIds));
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

export function selectNodeFromGeoId(geoId) {
  return (dispatch, getState) => {
    const state = getState();
    const selectedColumnsIds = getSelectedColumnsIds(state);
    const nodeId = getNodeIdFromGeoId(
      geoId,
      getState().toolLinks.data.nodes,
      selectedColumnsIds[0]
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
    const hasInvisibleNodes = true; // ids.some(elem => !_isNodeVisible(getState, elem));

    if (hasInvisibleNodes) {
      const state = getState();
      const { toolLinks } = state;
      if (
        toolLinks.selectedNodesIds.length === ids.length &&
        intesection(toolLinks.selectedNodesIds, ids).length === ids.length
      ) {
        dispatch(resetState());
      } else {
        const currentSelectedNodesIds = getState().toolLinks.selectedNodesIds;
        const selectedNodesIds = getSelectedNodeIds(currentSelectedNodesIds, ids);

        dispatch(updateNodes(selectedNodesIds));
        dispatch(expandSankey());
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
    const state = getState();
    const selectedColumnsIds = getSelectedColumnsIds(state);
    const {
      data: { nodes },
      highlightedNodesIds
    } = state.toolLinks;

    const nodeId = getNodeIdFromGeoId(geoId, nodes, selectedColumnsIds[0]);
    if (nodeId === null) {
      if (highlightedNodesIds.length) {
        dispatch(highlightNode(null));
      }
    } else {
      dispatch(highlightNode(nodeId, false, coordinates));
    }
  };
}

export function navigateToProfile(nodeId, year, contextId) {
  return (dispatch, getState) => {
    const node = getState().toolLinks.data.nodes[nodeId];
    dispatch({
      type: 'profileNode',
      payload: { query: { nodeId, year, contextId }, profileType: node.profileType }
    });
  };
}

export function loadLinkedGeoIDs() {
  return (dispatch, getState) => {
    const state = getState();
    const selectedColumnsIds = getSelectedColumnsIds(state);
    const selectedNodesIds = state.toolLinks.selectedNodesIds;

    // when selection only contains geo nodes (column 0), we should not call get_linked_geoids
    const selectedNodesColumnsPos = getSelectedNodesColumnsPos(state);
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
      target_column_id: selectedColumnsIds[0]
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
    const state = getState();
    const selectedMapDimensions = getSelectedMapDimensionsUids(state);
    dispatch({
      type: TOGGLE_MAP_DIMENSION,
      payload: {
        uid,
        selectedMapDimensions
      }
    });

    loadMapChoropleth(getState, dispatch);
  };
}

export function loadMapChoropleth(getState, dispatch) {
  const state = getState();

  const uids = getSelectedMapDimensionsUids(state);

  if (new Set(uids.filter(Boolean)).size === 0) {
    dispatch({
      type: SET_NODE_ATTRIBUTES,
      payload: { data: [] }
    });

    return;
  }

  const selectedMapDimensions = compact(uids).map(uid => state.toolLayers.data.mapDimensions[uid]);

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

const _isNodeVisible = (getState, nodeId) =>
  getState()
    .toolLinks.visibleNodes.map(node => node.id)
    .indexOf(nodeId) > -1;
