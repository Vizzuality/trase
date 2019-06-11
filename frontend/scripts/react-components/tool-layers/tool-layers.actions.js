export const TOOL_LAYERS__SET_LINKED_GEOIDS = 'TOOL_LAYERS__SET_LINKED_GEOIDS';

export function setLinkedGeoIds(nodes) {
  return {
    type: TOOL_LAYERS__SET_LINKED_GEOIDS,
    payload: { nodes }
  };
}
