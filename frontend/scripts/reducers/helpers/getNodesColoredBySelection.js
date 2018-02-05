// this returns only selected nodes IDs from the column that contains the most selected nodes
export default selectedNodesPerColumns => {
  let mostSelectedNodesColumn = 0;
  for (let i = 0, nodesAtColumnsLen = selectedNodesPerColumns.length; i < nodesAtColumnsLen; i++) {
    if (
      !selectedNodesPerColumns[mostSelectedNodesColumn] ||
      (selectedNodesPerColumns[i] &&
        selectedNodesPerColumns[i].length > selectedNodesPerColumns[mostSelectedNodesColumn].length)
    ) {
      mostSelectedNodesColumn = i;
    }
  }
  return {
    nodesColoredBySelection: selectedNodesPerColumns[mostSelectedNodesColumn] || [],
    nodesColoredAtColumn: mostSelectedNodesColumn
  };
};
