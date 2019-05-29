export default function(visibleNodesByColumn, nodeHeights) {
  const byHeight = (nodeA, nodeB) => {
    const heightA = nodeHeights[nodeA.id] && nodeHeights[nodeA.id].height;
    const heightB = nodeHeights[nodeA.id] && nodeHeights[nodeB.id].height;
    return heightA > heightB ? -1 : 1;
  };

  const byHeightOthersLast = (nodeA, nodeB) => {
    if (nodeA.isDomesticConsumption || nodeB.isDomesticConsumption) {
      if (nodeA.isDomesticConsumption) {
        return 1;
      }
      return -1;
    }
    if ((nodeA.isAggregated && !nodeB.isUnknown) || nodeA.isUnknown) {
      return 1;
    }
    if ((nodeB.isAggregated && !nodeA.isUnknown) || nodeB.isUnknown) {
      return -1;
    }
    return byHeight(nodeA, nodeB, nodeHeights);
  };

  return visibleNodesByColumn.map(column => ({
    ...column,
    values: [...column.values].sort(byHeightOthersLast)
  }));
}
