export default (selectedNodesIds, selectedNodesColumnsPos) => {
  const nodesAtColumns = [];
  selectedNodesColumnsPos.forEach((columnPosition, index) => {
    const nodeId = selectedNodesIds[index];
    const column = nodesAtColumns[columnPosition];
    if (column !== undefined) {
      column.push(nodeId);
    } else {
      nodesAtColumns[columnPosition] = [nodeId];
    }
  });

  return nodesAtColumns;
};
