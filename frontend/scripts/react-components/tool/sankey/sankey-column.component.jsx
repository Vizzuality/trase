import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function SankeyColumn(props) {
  const {
    column,
    highlightedNodeId,
    selectedNodesIds,
    onNodeClicked,
    onNodeHighlighted,
    sankeyColumnsWidth
  } = props;
  return (
    <g className="sankey-column" transform={`translate(${column.x},0)`}>
      <g className="sankey-nodes">
        {column.values.map((node, i, list) => (
          // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
          <g
            key={node.id}
            className={cx('sankey-node', {
              '-is-aggregated': node.isAggregated,
              '-is-domestic': node.isDomesticConsumption,
              '-is-alone-in-column': list.length === 1,
              '-highlighted': highlightedNodeId === node.id,
              '-selected': selectedNodesIds.includes(node.id)
            })}
            transform={`translate(0,${node.y})`}
            onClick={() => onNodeClicked(node.id, node.isAggregated)}
            onMouseOver={() => !node.isAggregated && onNodeHighlighted(node.id)}
            onMouseOut={() => !node.isAggregated && onNodeHighlighted(null)}
          >
            <rect
              className="sankey-node-rect"
              width={sankeyColumnsWidth}
              height={node.renderedHeight}
            />
            <text
              className="sankey-node-labels"
              transform={`translate(0,${-7 +
                node.renderedHeight / 2 -
                (node.label.length - 1) * 7})`}
            >
              {Array.isArray(node.label) &&
                node.label.map(label => (
                  <tspan
                    key={label}
                    className="sankey-node-label"
                    x={sankeyColumnsWidth / 2}
                    dy={12}
                  >
                    {label.toUpperCase()}
                  </tspan>
                ))}
            </text>
          </g>
        ))}
      </g>
    </g>
  );
}

SankeyColumn.propTypes = {
  column: PropTypes.object.isRequired,
  highlightedNodeId: PropTypes.number,
  selectedNodesIds: PropTypes.array.isRequired,
  onNodeClicked: PropTypes.func.isRequired,
  onNodeHighlighted: PropTypes.func.isRequired,
  sankeyColumnsWidth: PropTypes.number.isRequired
};

export default SankeyColumn;
