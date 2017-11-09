export default function (rawNodes, columns /*, nodesMeta*/) {
  // store in node dict for use in getVisibleNodes

  const nodesDict = {};
  const geoIdsDict = {};
  rawNodes.forEach(node => {
    const columnId = node.columnId;
    const column = columns.find(column => column.id === columnId);
    const newNode = {
      id: node.id,
      columnId: parseInt(node.columnId),
      columnName: column.name,
      type: column.name,
      columnGroup: column.group,
      isDefault: column.isDefault,
      isGeo: column.isGeo,
      name: node.name,
      profileType: column.profileType,
      geoId: node.geoId
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

    nodesDict[parseInt(node.id)] = newNode;
    if (node.geoId) {
      geoIdsDict[`${columnId}-${node.geoId}`] = node.id;
    }
  });
  return { nodesDict, geoIdsDict };
}
