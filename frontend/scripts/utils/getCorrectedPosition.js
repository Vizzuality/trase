export default (columns, columnId, extraColumnId) => {
  const column = columns[columnId];
  if (!extraColumnId) return column.group;
  if (extraColumnId === columnId) return column.group + 1;
  const extraColumnGroup = columns[extraColumnId].group;
  return column.group > extraColumnGroup ? column.group + 1 : column.group;
};
