/* eslint-disable jsx-a11y/mouse-events-have-key-events,import/no-extraneous-dependencies */
import React, { Component } from 'react';
import 'styles/components/profiles/mini-sankey.scss';
import formatValue from 'utils/formatValue';
import { interpolateNumber as d3InterpolateNumber } from 'd3-interpolate';
import wrapSVGText from 'utils/wrapSVGText';
import PropTypes from 'prop-types';

const BASE_HEIGHT = 400;
const TOTAL_WIDTH = 1000;
const SANKEY_WIDTH = 580;
const NODE_WIDTH = 10;
const NODE_V_SPACE = 15;
const TEXT_LINE_HEIGHT = 16;
const SANKEY_X_START = (TOTAL_WIDTH / 2) - (SANKEY_WIDTH / 2);
const SANKEY_X_END = SANKEY_X_START + SANKEY_WIDTH;

class MiniSankey extends Component {
  render() {
    const { data, targetLink, showTooltipCallback, hideTooltipCallback, year, onLinkClick } = this.props;
    const totalHeight = data.targetNodes.reduce((total, node) => total + (node.height * BASE_HEIGHT) + NODE_V_SPACE, 0);
    const startY = (totalHeight / 2) - (BASE_HEIGHT / 2);

    let currentStartNodeY = startY;
    let currentEndNodeY = 0;
    const nodes = data.targetNodes
      .sort((nodeA, nodeB) => (nodeB.height - nodeA.height))
      .map((node) => {
        const renderedHeight = BASE_HEIGHT * node.height;
        const lines = wrapSVGText(node.name, Math.max(TEXT_LINE_HEIGHT, renderedHeight), TEXT_LINE_HEIGHT, 18, 3);

        const n = {
          id: node.id,
          name: node.name,
          isDomesticConsumption: node.is_domestic_consumption,
          lines,
          renderedHeight,
          pct: `${formatValue(100 * node.height, 'percentage')}%`,
          sy: currentStartNodeY,
          ty: currentEndNodeY,
          value: node.value
        };
        currentStartNodeY += n.renderedHeight;
        currentEndNodeY += n.renderedHeight + NODE_V_SPACE;
        return n;
      });

    return (
      <div className="mini-sankey">
        <svg style={{ height: totalHeight, width: TOTAL_WIDTH }}>

          <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" className="gradient-color-start" />
            <stop offset="100%" className="gradient-color-end" />
          </linearGradient>

          <g transform={`translate(${SANKEY_X_START}, ${startY})`}>
            <rect
              width={NODE_WIDTH}
              height={BASE_HEIGHT}
              className="start"
            />
            <text
              className="start"
              transform={`translate(-20, ${5 + (BASE_HEIGHT / 2)})`}
            >
              {data.name}
            </text>
          </g>

          <g transform={`translate(${SANKEY_X_END}, 0)`}>
            {nodes.map((node, index) => (
              <g
                key={index}
                transform={`translate(0, ${node.ty})`}
                className={(!node.isDomesticConsumption && targetLink) ? 'interactive-node' : null}
                onClick={() => {
                  if (node.isDomesticConsumption || !targetLink) return;
                  onLinkClick(
                    targetLink,
                    {
                      nodeId: node.id,
                      year
                    }
                  );
                }}
              >
                <rect
                  width={NODE_WIDTH}
                  height={node.renderedHeight}
                  className="end"
                />
                <text
                  className="end"
                  transform={`translate(20,
                ${(13 + (node.renderedHeight / 2)) - ((TEXT_LINE_HEIGHT * node.lines.length) / 2)})`}
                >
                  {node.lines.map((line, i) =>
                    <tspan key={i} y={i * TEXT_LINE_HEIGHT} x="0">{line} </tspan>)}
                  <tspan className="pct">{node.pct}</tspan>
                </text>
              </g>))}
          </g>

          <g transform={`translate(${SANKEY_X_START}, 0)`}>
            {nodes.map((node, index) => {
              const x0 = NODE_WIDTH;
              const x1 = SANKEY_X_END - SANKEY_X_START;
              const xi = d3InterpolateNumber(x0, x1);
              const x2 = xi(0.6);
              const x3 = xi(0.4);
              const y0 = node.sy + (node.renderedHeight / 2);
              const y1 = node.ty + (node.renderedHeight / 2);
              const path = `M${x0},${y0
              }C${x2},${y0
              } ${x3},${y1
              } ${x1},${y1}`;
              return (
                <path
                  key={index}
                  d={path}
                  strokeWidth={node.renderedHeight}
                  className={node.isAggregated ? 'link-aggr' : 'link'}
                  onMouseLeave={hideTooltipCallback}
                  onMouseMove={(event) => {
                    showTooltipCallback(
                      node.name,
                      data.indicator,
                      node.value,
                      data.unit,
                      event.clientX + 10,
                      event.clientY + window.scrollY + 10
                    );
                  }}
                />
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
}

MiniSankey.propTypes = {
  data: PropTypes.object,
  targetLink: PropTypes.string,
  showTooltipCallback: PropTypes.func,
  hideTooltipCallback: PropTypes.func,
  onLinkClick: PropTypes.func,
  year: PropTypes.number
};

export default MiniSankey;
