export const TOOL_LAYERS__SET_LINKED_GEOIDS = 'TOOL_LAYERS__SET_LINKED_GEOIDS';
export const TOOL_LAYERS__SET_MAP_DIMENSIONS = 'TOOL_LAYERS__SET_MAP_DIMENSIONS';
export const TOOL_LAYERS__SAVE_MAP_VIEW = 'TOOL_LAYERS__SAVE_MAP_VIEW';
export const TOOL_LAYERS__SET_ACTIVE_MODAL = 'TOOL_LAYERS__SET_ACTIVE_MODAL';

export function setLinkedGeoIds(nodes) {
  return {
    type: TOOL_LAYERS__SET_LINKED_GEOIDS,
    payload: { nodes }
  };
}

export function setMapDimensions(dimensions, dimensionGroups) {
  return {
    type: TOOL_LAYERS__SET_MAP_DIMENSIONS,
    payload: { dimensions, dimensionGroups }
  };
}

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
