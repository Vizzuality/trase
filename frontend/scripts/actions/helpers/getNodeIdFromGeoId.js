export default (geoId, nodesDict, selectedGeoColumnId) => {
  if (geoId === undefined || geoId === null) {
    return null;
  }

  // node should match geoId obv, but also columnId
  // (needed because municip and logistics hubs have the same geoIds)
  const selectedNodeId = Object.keys(nodesDict).find(
    nodeId =>
      nodesDict[nodeId].geoId === geoId && selectedGeoColumnId === nodesDict[nodeId].columnId
  );

  return parseInt(selectedNodeId, 10);
};
