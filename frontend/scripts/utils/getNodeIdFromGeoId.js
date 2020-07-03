export default (geoId, nodes, selectedGeoColumnIds) => {
  if (geoId === undefined || geoId === null || !nodes) {
    return null;
  }
  // node should match geoId obv, but also columnId
  // (needed because municip and logistics hubs have the same geoIds)

  // TODO: Indonesia MILL dont have the correct ID
  const selectedNodeId = Object.keys(nodes).find(
    nodeId =>
      (nodes[nodeId].geoId === geoId ||
      (nodes[nodeId].type === 'MILL' &&
        nodes[nodeId].name === geoId) &&
        selectedGeoColumnIds.includes(nodes[nodeId].columnId))
  );
  if (selectedNodeId === undefined) return null;

  return parseInt(selectedNodeId, 10);
};
