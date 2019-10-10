export const TOOL_LAYERS__SET_LINKED_GEOIDS = 'TOOL_LAYERS__SET_LINKED_GEOIDS';
export const TOOL_LAYERS__SET_MAP_DIMENSIONS = 'TOOL_LAYERS__SET_MAP_DIMENSIONS';
export const SET_SANKEY_SIZE = 'SET_SANKEY_SIZE';

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
