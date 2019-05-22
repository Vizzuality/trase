export default function(rawNodes, columns /* , nodesMeta */) {
  // store in node dict for use in getVisibleNodes

  const nodesDict = {};
  const geoIdsDict = {};
  rawNodes.forEach(node => {
    const columnId = node.columnId;
    const matchingColumn = columns.find(column => column.id === columnId);
    const newNode = {
      id: node.id,
      columnId: parseInt(node.columnId, 10),
      name: node.name,
      geoId: node.geoId,
      type: matchingColumn.name,
      isGeo: matchingColumn.isGeo,
      columnName: matchingColumn.name,
      columnGroup: matchingColumn.group,
      isDefault: matchingColumn.isDefault,
      profileType: matchingColumn.profileType
    };

    if (node.isDomesticConsumption === true || node.isDomesticConsumption === 'true') {
      newNode.isDomesticConsumption = true;
    }

    if (node.isAggregated === true || node.isAggregated === 'true') {
      newNode.isAggregated = true;
    }

    if (node.isUnknown === true || node.isUnknown === 'true') {
      newNode.isUnknown = true;
    }

    if (node.hasFlows === true || node.hasFlows === 'true') {
      newNode.hasFlows = true;
    }

    nodesDict[parseInt(node.id, 10)] = newNode;
    if (node.geoId) {
      geoIdsDict[`${columnId}-${node.geoId}`] = node.id;
    }
  });
  return { nodesDict, geoIdsDict };
}
