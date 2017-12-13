export default (node, selectedColumnsIds = []) => {
  const columnGroup = node.columnGroup;
  const currentColumnAtPos = selectedColumnsIds[columnGroup];
  return currentColumnAtPos === node.columnId;
};