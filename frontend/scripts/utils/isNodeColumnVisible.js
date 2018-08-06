export default (node, selectedColumnsIds = []) => {
  const { columnGroup } = node;
  const currentColumnAtPos = selectedColumnsIds[columnGroup];
  return currentColumnAtPos === node.columnId;
};
