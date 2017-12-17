const byHeight = (nodeA, nodeB) => ((nodeA.height > nodeB.height) ? -1 : 1);

const byHeightOthersLast = (nodeA, nodeB) => {
  if (nodeA.isDomesticConsumption || nodeB.isDomesticConsumption) {
    if (nodeA.isDomesticConsumption) {
      return 1;
    }
    return -1;
  }
  if ((nodeA.isAggregated && !nodeB.isUnknown) || nodeA.isUnknown) {
    return 1;
  } else if ((nodeB.isAggregated && !nodeA.isUnknown) || nodeB.isUnknown) {
    return -1;
  }
  return byHeight(nodeA, nodeB);
};

// TODO: add sorting by selectedNodes in detailed mode here
export default function (visibleNodesByColumn) {
  visibleNodesByColumn.forEach((column) => {
    column.values.sort(byHeightOthersLast);
  });

  return visibleNodesByColumn;
}
