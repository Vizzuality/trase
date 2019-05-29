export default (column, selectedColumnsIds = []) => {
  const currentColumnAtPos = selectedColumnsIds[column.group];
  return currentColumnAtPos === column.id;
};
