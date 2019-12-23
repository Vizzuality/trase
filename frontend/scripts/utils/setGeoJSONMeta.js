export default (geoJSON, nodes, nodesByColumnGeoId, columnId) => {
  geoJSON.features.forEach(feature => {
    if (feature.properties.GEO_ID !== undefined) {
      feature.properties.geoid = feature.properties.GEO_ID;
    }
    const geoId = feature.properties.geoid;
    const nodeId = nodesByColumnGeoId[`${columnId}-${geoId}`];
    const node = nodes[nodeId];
    if (node) {
      feature.properties.hasFlows = node.hasFlows;
    }
  });
  return geoJSON;
};
