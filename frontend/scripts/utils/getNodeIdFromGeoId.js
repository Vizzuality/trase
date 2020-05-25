export default (geoId, nodes, selectedGeoColumnId) => {
  if (geoId === undefined || geoId === null || !nodes) {
    return null;
  }

  // node should match geoId obv, but also columnId
  // (needed because municip and logistics hubs have the same geoIds)
  const selectedNodeId = Object.keys(nodes).find(
    nodeId => nodes[nodeId].geoId === geoId && selectedGeoColumnId === nodes[nodeId].columnId
  );

  if (selectedNodeId === undefined) return null;

  return parseInt(selectedNodeId, 10);
};
