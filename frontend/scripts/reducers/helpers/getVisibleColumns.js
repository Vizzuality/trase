export default function (columns, columnIndexes) {
  return columnIndexes.map((index) => {
    const matchingColumn = columns.find(column => column.id === index);
    return {
      index,
      name: matchingColumn.name
    };
  });
}
