export default (geoJSON, nodesDict, geoIdsDict, columnId) => {
  geoJSON.features.forEach(feature => {
    if (feature.properties.GEO_ID !== undefined) {
      feature.properties.geoid = feature.properties.GEO_ID;
    }
    const geoId = feature.properties.geoid;
    const nodeId = geoIdsDict[`${columnId}-${geoId}`];
    const node = nodesDict[nodeId];
    if (node) {
      feature.properties.hasFlows = node.hasFlows;
    }
  });
  return geoJSON;
};
