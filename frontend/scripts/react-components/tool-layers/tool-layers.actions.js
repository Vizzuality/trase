import axios from 'axios';
import pick from 'lodash/pick';

export const TOOL_LAYERS__SET_LINKED_GEOIDS = 'TOOL_LAYERS__SET_LINKED_GEOIDS';
export const TOOL_LAYERS__SET_MAP_DIMENSIONS = 'TOOL_LAYERS__SET_MAP_DIMENSIONS';
export const TOOL_LAYERS__SAVE_MAP_VIEW = 'TOOL_LAYERS__SAVE_MAP_VIEW';
export const TOOL_LAYERS__SET_ACTIVE_MODAL = 'TOOL_LAYERS__SET_ACTIVE_MODAL';
export const TOOL_LAYERS__SET_UNIT_LAYERS = 'TOOL_LAYERS__SET_UNIT_LAYERS';
export const TOOL_LAYERS__SET_UNIT_LAYER_DATA = 'TOOL_LAYERS__SET_UNIT_LAYER_DATA';
export const TOOL_LAYERS__SET_INSPECTION_LEVEL = 'LOGISTIC_LEGEND__SET_INSPECTION_LEVEL';

export function setLogisticInspectionLevel(inspectionLevel) {
  return {
    type: TOOL_LAYERS__SET_INSPECTION_LEVEL,
    payload: { inspectionLevel }
  };
}

export function setLinkedGeoIds(nodes) {
  return {
    type: TOOL_LAYERS__SET_LINKED_GEOIDS,
    payload: { nodes }
  };
}

export function setUnitLayerData(rows) {
  return {
    type: TOOL_LAYERS__SET_UNIT_LAYER_DATA,
    payload: { data: rows }
  };
}

export function setMapDimensions(dimensions, dimensionGroups) {
  return {
    type: TOOL_LAYERS__SET_MAP_DIMENSIONS,
    payload: { dimensions, dimensionGroups }
  };
}

export function loadUnitLayers() {
  return async (dispatch, getState) => {
    if (!getState().toolLayers.data.mapUnitLayers) {
      const urlsPromise = await axios.get(`${UNIT_LAYERS_API_URL}/services`);
      const urls = urlsPromise?.data.map(d => d.url);
      if (urls && urls.length) {
        const layersPromise = await Promise.all(urls.map(url => axios.get(url)));
        const layers =
          layersPromise &&
          layersPromise.map(l =>
            pick(l.data, ['bounds', 'center', 'id', 'maxzoom', 'minzoom', 'tiles', 'version'])
          );
        return dispatch({
          type: TOOL_LAYERS__SET_UNIT_LAYERS,
          payload: { layers }
        });
      }
      return undefined;
    }
    return undefined;
  }
};

export function saveMapView(latlng, zoom) {
  return {
    type: TOOL_LAYERS__SAVE_MAP_VIEW,
    latlng,
    zoom
  };
}

export function setActiveModal(activeModal) {
  return {
    type: TOOL_LAYERS__SET_ACTIVE_MODAL,
    payload: { activeModal }
  };
}
