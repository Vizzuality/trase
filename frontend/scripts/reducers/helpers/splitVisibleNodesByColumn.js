/* eslint-disable camelcase,import/no-extraneous-dependencies */
import { nest as d3_nest } from 'd3-collection';

export default function(nodes) {
  const columns = d3_nest()
    .key(el => el.columnGroup)
    .sortKeys((a, b) => (parseInt(a, 10) < parseInt(b, 10) ? -1 : 1))
    .entries(nodes);

  columns.forEach(column => {
    column.columnId = parseInt(column.key, 10);

    // flag node as belonging to a single-node column
    column.values[0].isAloneInColumn = column.values.length === 1;
  });

  return columns;
}
