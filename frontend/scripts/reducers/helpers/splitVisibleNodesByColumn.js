/* eslint-disable camelcase,import/no-extraneous-dependencies */
import { nest as d3_nest } from 'd3-collection';

export default function(nodes, columns) {
  const nodesByColumn = d3_nest()
    .key(el => {
      const { columnId } = el;
      const column = columns[columnId];
      return Number(column.group);
    })
    .sortKeys((a, b) => (parseInt(a, 10) < parseInt(b, 10) ? -1 : 1))
    .entries(nodes);

  nodesByColumn.forEach(node => {
    node.columnId = Number(node.key);

    // flag node as belonging to a single-node column
    node.values[0].isAloneInColumn = node.values.length === 1;
  });

  return nodesByColumn;
}
