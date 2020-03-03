/* eslint-disable camelcase,import/no-extraneous-dependencies */
import { nest as d3_nest } from 'd3-collection';
import { MIN_COLUMNS_NUMBER } from 'constants';
import getCorrectedPosition from 'utils/getCorrectedPosition';

export default function(nodes, columns, extraColumnId, minColumns = MIN_COLUMNS_NUMBER) {
  const nodesByColumn = d3_nest()
    .key(el => {
      const { columnId } = el;
      const column = columns[columnId];
      return `${Number(getCorrectedPosition(columns, column.id, extraColumnId))}-${Number(
        column.id
      )}`;
    })
    .sortKeys((a, b) => (parseInt(a, 10) < parseInt(b, 10) ? -1 : 1))
    .entries(nodes);

  // because we load columns on demand, when changing columns we might run into the scenario
  // where we have x loaded columns and the new one still loading. In this case we want to find the column group that's missing
  // and add an empty stub.
  if (nodesByColumn.length > 0 && nodesByColumn.length < minColumns) {
    // we need to know which column to stub
    const keys = nodesByColumn.map(col => Number(col.key));
    const missingColumnIndex = keys.findIndex((key, i) => key !== i);
    if (missingColumnIndex !== -1) {
      const stubColumn = { key: `${missingColumnIndex}`, values: [] };
      return [...nodesByColumn].splice(missingColumnIndex, 0, stubColumn);
    }
  }
  return nodesByColumn;
}
