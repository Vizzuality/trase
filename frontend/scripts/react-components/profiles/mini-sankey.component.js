import { h } from 'preact';
import 'styles/components/profiles/mini-sankey.scss';
import formatValue from 'utils/formatValue';
import { interpolateNumber as d3_interpolateNumber } from 'd3-interpolate';
import wrapSVGText from 'utils/wrapSVGText';

const BASE_HEIGHT = 400;
const TOTAL_WIDTH = 1000;
const SANKEY_WIDTH = 580;
const NODE_WIDTH = 10;
const NODE_V_SPACE = 15;
const TEXT_LINE_HEIGHT = 16;
const SANKEY_X_START = TOTAL_WIDTH / 2 - SANKEY_WIDTH / 2;
const SANKEY_X_END = SANKEY_X_START + SANKEY_WIDTH;

export default ({ data, targetLink }) => {
  const totalHeight = data.targetNodes.reduce((total, node) => total + node.height * BASE_HEIGHT + NODE_V_SPACE, 0);
  const startY = totalHeight / 2 - BASE_HEIGHT / 2;

  let currentStartNodeY = startY;
  let currentEndNodeY = 0;
  const nodes = data.targetNodes
    .sort((nodeA, nodeB) => {
      if (nodeA.isAggregated === true || nodeB.isAggregated === true) {
        return (nodeA.isAggregated === true) ? 1 : -1;
      }
      return nodeB.height - nodeA.height;
    })
    .map(node => {
      const renderedHeight = BASE_HEIGHT * node.height;
      const lines = wrapSVGText(node.name, Math.max(TEXT_LINE_HEIGHT, renderedHeight), TEXT_LINE_HEIGHT, 18, 3);

      const n = {
        id: node.id,
        name: node.name,
        isAggregated: node.isAggregated,
        lines,
        renderedHeight,
        link: targetLink ? `/profile-${targetLink}?nodeId=${node.id}` : null,
        pct:`${formatValue(100 * node.height, 'percentage')}%`,
        sy: currentStartNodeY,
        ty: currentEndNodeY
      };
      currentStartNodeY += n.renderedHeight;
      currentEndNodeY += n.renderedHeight + NODE_V_SPACE;
      return n;
    });

  return (
    <div class='mini-sankey'>
      <svg style={{ height: totalHeight, width: TOTAL_WIDTH }}>

        <linearGradient id='gradient' x1='0' x2='1' y1='0' y2='0'>
          <stop offset='0%' class='gradient-color-start' />
          <stop offset='100%' class='gradient-color-end' />
        </linearGradient>

        <g transform={`translate(${SANKEY_X_START}, ${startY})`}>
          <rect
            width={NODE_WIDTH}
            height={BASE_HEIGHT}
            class='start'
          />
          <text
            class='start'
            transform={`translate(-20, ${5 + BASE_HEIGHT/2})`}
          >
            {data.name}
          </text>
        </g>

        <g transform={`translate(${SANKEY_X_END}, 0)`}>
          {nodes.map(node => {
            return <g
              transform={`translate(0, ${node.ty})`}
              class={node.link ? 'interactive-node' : null}
              onClick={node.link ? () => { window.location = node.link; } : null}
            >
              <rect
                width={NODE_WIDTH}
                height={node.renderedHeight}
                class={node.isAggregated ? 'aggr' : 'end'}
              />
              <text
                class='end'
                transform={`translate(20, ${ 13 + node.renderedHeight/2 - (TEXT_LINE_HEIGHT*node.lines.length)/2})`}
              >
                {node.lines.map((line, i) =>
                  <tspan y={i*TEXT_LINE_HEIGHT} x='0'>{line} </tspan>
                )}
                <tspan class='pct'>{node.pct}</tspan>
              </text>
            </g>;
          })}
        </g>

        <g transform={`translate(${SANKEY_X_START}, 0)`}>
          {nodes.map(node => {
            var x0 = NODE_WIDTH,
              x1 = SANKEY_X_END - SANKEY_X_START,
              xi = d3_interpolateNumber(x0, x1),
              x2 = xi(.6),
              x3 = xi(.4),
              y0 = node.sy + node.renderedHeight / 2,
              y1 = node.ty + node.renderedHeight / 2;
            const path = 'M' + x0 + ',' + y0
                 + 'C' + x2 + ',' + y0
                 + ' ' + x3 + ',' + y1
                 + ' ' + x1 + ',' + y1;
            return <path
              d={path}
              stroke-width={node.renderedHeight}
              class={node.isAggregated ? 'link-aggr' : 'link'}
            />;
          })}
        </g>
      </svg>
    </div>
  );
};
