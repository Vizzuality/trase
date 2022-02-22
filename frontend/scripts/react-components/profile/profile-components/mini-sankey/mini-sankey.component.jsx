/* eslint-disable jsx-a11y/mouse-events-have-key-events,import/no-extraneous-dependencies */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { interpolateNumber as d3InterpolateNumber } from 'd3-interpolate';
import find from 'lodash/find';

import formatValue from 'utils/formatValue';
import wrapSVGText from 'utils/wrapSVGText';
import { translateText } from 'utils/transifex';
import scrollOffset from 'utils/scroll-offset';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';

import Responsive from 'react-components/shared/responsive.hoc';

import './mini-sankey.scss';

const BASE_HEIGHT = 400;
const TEXT_WIDTH_PERCENTAGE = 20;
const NODE_WIDTH = 10;
const NODE_WIDTH_SMALL = 4;
const NODE_V_SPACE = 15;
const TEXT_LINE_HEIGHT = 16;
const MEDIUM_RES = 768;

const roundHeight = height => {
  const h = BASE_HEIGHT * height;
  if (h > 1 || parseInt(h * 10, 10) <= 1) return h;
  return Math.ceil(h);
};

const MiniSankey = props => {
  const [tooltipConfig, setTooltipConfig] = useState();
  const showTooltipCallback = (source, indicator, value, unit, x, y) => {
    const text = source;
    const items = [
      {
        title: indicator,
        value: formatValue(value, unit),
        unit
      }
    ];

    setTooltipConfig({ x, y, text, items });
  };

  const hideTooltipCallback = () => {
    setTooltipConfig(null);
  };

  const {
    data,
    onLinkClick,
    targetLink,
    width,
    year,
    targetPayload,
    contextId,
    testId,
    invert
  } = props;
  const totalHeight = data.targetNodes.reduce(
    (total, node) => total + Math.ceil(node.height * BASE_HEIGHT) + NODE_V_SPACE,
    0
  );

  const halfHeight = totalHeight / 2;
  const halfBasePlusSpace = (BASE_HEIGHT + NODE_V_SPACE) / 2;
  const halfBase = BASE_HEIGHT / 2;
  const startY =
    halfHeight <= halfBasePlusSpace ? halfHeight - halfBase : halfHeight - halfBasePlusSpace;

  const isSmallResolution = width < MEDIUM_RES;
  const nodeWidth = isSmallResolution ? NODE_WIDTH_SMALL : NODE_WIDTH;
  const textMinWidth = isSmallResolution ? 130 : 200;
  const leftTextRotate = isSmallResolution ? '-90' : '0';
  const rightTextWidth = Math.max((width * TEXT_WIDTH_PERCENTAGE) / 100, textMinWidth);
  const smallResolutionLeftTextWidth = invert ? rightTextWidth : 20;
  const leftTextWidth = isSmallResolution ? smallResolutionLeftTextWidth : rightTextWidth;
  const sankeyXStart = leftTextWidth;
  const sankeyWidth = invert
    ? width - (leftTextWidth + rightTextWidth / 2)
    : width - (leftTextWidth + rightTextWidth);
  const sankeyXEnd = sankeyXStart + sankeyWidth;

  let currentStartNodeY = startY;
  let currentEndNodeY = 0;
  const wrapSVG = (text, labelCharHeight) =>
    wrapSVGText(
      text,
      labelCharHeight || TEXT_LINE_HEIGHT,
      TEXT_LINE_HEIGHT,
      isSmallResolution ? 11 : 18,
      3
    );

  const nodes = [...data.targetNodes].map(node => {
    const renderedHeight = roundHeight(node.height);

    const lines = wrapSVG(translateText(node.name), Math.max(TEXT_LINE_HEIGHT, renderedHeight));
    const percent = 100 * node.height;
    const n = {
      id: node.id,
      name: node.name,
      isDomesticConsumption: node.is_domestic_consumption,
      lines,
      renderedHeight,
      pct: `${percent * 10 >= 1 ? formatValue(percent, 'percentage') : '< 0.1'}%`,
      sy: currentStartNodeY,
      ty: currentEndNodeY,
      value: node.value
    };

    currentStartNodeY += n.renderedHeight;
    currentEndNodeY += n.renderedHeight + NODE_V_SPACE;
    return n;
  });

  const sortedNodes = [
    ...nodes.filter(n => n.name !== 'OTHER'),
    find(nodes, { name: 'OTHER' })
  ].sort((nodeA, nodeB) => {
    if (nodeA.name === 'OTHER') return -1;
    if (nodeB.name === 'OTHER') return 1;
    return nodeB.height - nodeA.height;
  });
  const renderTspans = lines =>
    lines.map((line, i) => (
      <tspan key={i} y={i * TEXT_LINE_HEIGHT} x="0">
        {line}{' '}
      </tspan>
    ));
  return (
    <div className="mini-sankey" data-test={testId}>
      <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
      <svg style={{ height: totalHeight, width }}>
        <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" className="gradient-color-start" />
          <stop offset="100%" className="gradient-color-end" />
        </linearGradient>

        <g
          transform={
            invert ? `translate(${sankeyXEnd}, ${startY})` : `translate(${sankeyXStart}, ${startY})`
          }
        >
          <rect width={nodeWidth} height={BASE_HEIGHT} className={invert ? 'end' : 'start'} />
          <text
            className={invert ? 'end' : 'start'}
            transform={`translate(${invert ? nodeWidth + 10 : '-10'}, ${5 +
              BASE_HEIGHT / 2}) rotate(${leftTextRotate})`}
          >
            {renderTspans(wrapSVG(data.name, totalHeight))}
          </text>
        </g>

        <g transform={`translate(${invert ? sankeyXStart : sankeyXEnd}, 0)`}>
          {sortedNodes.map((node, index) => (
            <g
              key={index}
              transform={`translate(0, ${node.ty})`}
              className={!node.isDomesticConsumption && targetLink ? 'interactive-node' : null}
              onClick={() => {
                if (node.isDomesticConsumption || !targetLink) return;
                onLinkClick(targetLink, {
                  ...(targetPayload || {}),
                  query: {
                    year,
                    contextId,
                    nodeId: node.id
                  }
                });
              }}
            >
              <rect
                width={nodeWidth}
                height={node.renderedHeight}
                className={invert ? 'start' : 'end'}
              />
              <text
                className={invert ? 'start' : 'end'}
                transform={`translate(${invert ? -nodeWidth : nodeWidth + 10},
              ${13 + node.renderedHeight / 2 - (TEXT_LINE_HEIGHT * node.lines.length) / 2})`}
              >
                {renderTspans(node.lines)}
                <tspan className="pct">{node.pct}</tspan>
              </text>
            </g>
          ))}
        </g>

        <g transform={`translate(${sankeyXStart}, 0)`}>
          {sortedNodes.map((node, index) => {
            const x0 = nodeWidth;
            const x1 = sankeyXEnd - sankeyXStart;
            const xi = d3InterpolateNumber(x0, x1);
            const x2 = xi(0.6);
            const x3 = xi(0.4);
            const y0 = node.sy + node.renderedHeight / 2;
            const y1 = node.ty + node.renderedHeight / 2;
            const path = invert
              ? `M${x0},${y1}C${x3},${y1} ${x2},${y0} ${x1},${y0}`
              : `M${x0},${y0}C${x2},${y0} ${x3},${y1} ${x1},${y1}`;

            return (
              <path
                key={index}
                d={path}
                strokeWidth={node.renderedHeight}
                data-test={`${testId}-flow`}
                className={node.isAggregated ? 'link-aggr' : 'link'}
                onMouseLeave={hideTooltipCallback}
                onMouseMove={event =>
                  showTooltipCallback(
                    node.name,
                    data.indicator,
                    node.value,
                    data.unit,
                    event.clientX + 10,
                    event.clientY + scrollOffset() + 10
                  )
                }
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

MiniSankey.propTypes = {
  data: PropTypes.object,
  testId: PropTypes.string,
  onLinkClick: PropTypes.func,
  targetLink: PropTypes.string,
  targetPayload: PropTypes.object,
  width: PropTypes.number,
  year: PropTypes.number,
  contextId: PropTypes.number,
  invert: PropTypes.bool
};

export default Responsive()(MiniSankey);
