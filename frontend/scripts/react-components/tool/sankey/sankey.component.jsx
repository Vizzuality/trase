import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import formatValue from 'utils/formatValue';
import Heading from 'react-components/shared/heading';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import { TOOL_LAYOUT, MIN_COLUMNS_NUMBER, NODE_TYPES } from 'constants';
import { handleNodeOver } from './node-interaction-utils';
import { useNodeRefHeight, useMenuOptions, useMenuPosition } from './sankey-hooks';
import RecolorByLegend from './recolor-by-legend';
import SankeyColumn from './sankey-column.component';
import NodeMenu from './node-menu.component';
import SankeyLink from './sankey-link.component';
import * as Defs from './sankey-defs.component';

import 'react-components/tool/sankey/sankey.scss';

const getLinkColor = (selectedRecolorBy, link) => {
  let classPath = 'sankey-link';
  if (selectedRecolorBy) {
    if (link.recolorBy === null) {
      return classPath;
    }
    let recolorBy = link.recolorBySlug || link.recolorBy;
    if (selectedRecolorBy.divisor) {
      recolorBy = Math.floor(link.recolorBy / selectedRecolorBy.divisor);
    }
    const legendTypeClass = selectedRecolorBy.legendType.toString().toLowerCase();
    const legendColorThemeClass = selectedRecolorBy.legendColorTheme.toString().toLowerCase();
    const { nodes } = selectedRecolorBy;
    const recolorDefaultIndex =
      nodes.indexOf(link.recolorBy) !== -1 && nodes.indexOf(link.recolorBy) + 1;
    classPath = `${classPath} -recolorby-qual-default-${recolorDefaultIndex} -recolorby-${legendTypeClass}-${legendColorThemeClass}-${recolorBy}`;
  } else {
    classPath = `${classPath} -recolorgroup-${link.recolorGroup}`;
  }

  return classPath;
};

function Sankey(props) {
  const {
    columns,
    links,
    maxHeight,
    flowsLoading,
    nodeHeights,
    otherNodes,
    nodeAttributes,
    selectedMapDimensions,
    sankeyColumnsWidth,
    selectedResizeBy,
    detailedView,
    selectedRecolorBy,
    onNodeClicked,
    highlightedNodeId,
    gapBetweenColumns,
    onNodeHighlighted,
    selectedNodesIds,
    toolLayout,
    extraColumnId,
    selectedContext,
    toolColumns
  } = props;
  const [hoveredLink, setHoveredLink] = useState(null);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipDisclaimer, setTooltipDisclaimer] = useState(null);
  const svgRef = useRef(null);
  const layoutRects = useRef([]);
  const getRect = layout => {
    if (layoutRects.current[layout]) {
      return layoutRects.current[layout];
    }
    layoutRects.current[layout] = svgRef.current.getBoundingClientRect();
    return layoutRects.current[layout];
  };
  const [
    menuPos,
    scrollContainerRef,
    hoveredSelectedNode,
    setHoveredSelectedNode
  ] = useMenuPosition(props);
  const menuOptions = useMenuOptions(props, hoveredSelectedNode);
  const placeholderHeight = useNodeRefHeight(scrollContainerRef);

  const onLinkOver = (e, link) => {
    const rect = getRect(toolLayout);
    const tooltip = {
      text: `${link.sourceNodeName} > ${link.targetNodeName}`,
      x: e.clientX - rect.x,
      y: e.clientY - rect.y,
      height: rect.height,
      width: rect.width,
      items: [
        {
          title: selectedResizeBy.label,
          unit: selectedResizeBy.unit,
          value: formatValue(link.quant, selectedResizeBy.label)
        }
      ]
    };
    if (selectedRecolorBy) {
      let recolorValue = null;
      let recolorChildren = null;
      if (link.recolorBy === null) {
        recolorValue = 'Unknown';
      } else {
        recolorChildren = <RecolorByLegend value={link.recolorBy} />;
      }

      tooltip.items.push({
        title: selectedRecolorBy.label,
        value: recolorValue,
        children: recolorChildren
      });
    }

    setHoveredLink(link.id);
    setTooltipContent(tooltip);
  };

  const onLinkOut = () => {
    setHoveredLink(null);
    setTooltipContent(null);
  };

  const onNodeOver = (e, node) =>
    handleNodeOver({
      node,
      setTooltipContent,
      setHoveredSelectedNode,
      onNodeHighlighted,
      setTooltipDisclaimer,
      getRect,
      toolLayout,
      nodeHeights,
      selectedResizeBy,
      selectedMapDimensions,
      selectedContext,
      selectedNodesIds,
      otherNodes,
      nodeAttributes,
      toolColumns,
      columns,
      scrollContainerRef,
      sankeyColumnsWidth,
      links
    });

  const onNodeOut = () => {
    setTooltipContent(null);
    onNodeHighlighted(null);
  };

  const loading = !columns || columns.length === 0 || !links || flowsLoading;
  const regularloadingPos = gapBetweenColumns + 2 * sankeyColumnsWidth + gapBetweenColumns / 2;
  const extraColumnLoadingPos =
    2 * sankeyColumnsWidth + 2 * gapBetweenColumns + sankeyColumnsWidth / 2;
  return (
    <div className={cx('c-sankey', { '-full-screen': toolLayout === TOOL_LAYOUT.right })}>
      <UnitsTooltip
        {...tooltipContent}
        disclaimer={tooltipDisclaimer}
        className="tooltip-max-width"
        show={!!tooltipContent}
      />
      <div
        ref={scrollContainerRef}
        className={cx('sankey-scroll-container', { '-detailed': detailedView })}
      >
        {loading && (
          <div
            className="sankey-loading"
            style={{ left: extraColumnId ? extraColumnLoadingPos : regularloadingPos }}
          >
            <Heading variant="mono" size="md" weight="bold">
              Loading
            </Heading>
          </div>
        )}
        {!loading && (
          <NodeMenu
            menuPos={menuPos}
            isVisible={
              selectedNodesIds.length > 0 ||
              hoveredSelectedNode?.type === NODE_TYPES.countryOfProduction
            }
            options={menuOptions}
            containerRef={scrollContainerRef}
          />
        )}
        <svg
          ref={svgRef}
          className="sankey"
          key={`svg-container-${toolLayout}`}
          style={{ height: detailedView ? `${maxHeight}px` : '100%' }}
        >
          <defs>
            <Defs.IsAggregate />
            <Defs.GradientAnimation
              candyMode={
                window._TRASE_CANDY_SANKEY &&
                selectedRecolorBy &&
                selectedRecolorBy.name === 'BIOME'
              }
            />
          </defs>
          <g className="sankey-container">
            <g className="sankey-links">
              {!loading &&
                links.map(link => (
                  // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                  <SankeyLink
                    key={link.id}
                    link={link}
                    onMouseOut={onLinkOut}
                    onMouseOver={e => onLinkOver(e, link)}
                    className={cx(getLinkColor(selectedRecolorBy, link), {
                      '-hover': hoveredLink === link.id
                    })}
                  />
                ))}
              {loading && (
                <Defs.LinksPlaceHolder
                  height={maxHeight > 0 ? maxHeight : placeholderHeight}
                  gapBetweenColumns={gapBetweenColumns}
                  sankeyColumnsWidth={sankeyColumnsWidth}
                  size={extraColumnId ? MIN_COLUMNS_NUMBER : MIN_COLUMNS_NUMBER - 1}
                />
              )}
            </g>
            <g className="sankey-columns">
              {!loading &&
                columns.map(column => (
                  <SankeyColumn
                    key={column.key}
                    column={column}
                    onNodeOver={onNodeOver}
                    onNodeOut={onNodeOut}
                    selectedNodesIds={selectedNodesIds}
                    onNodeClicked={onNodeClicked}
                    highlightedNodeId={highlightedNodeId}
                    sankeyColumnsWidth={sankeyColumnsWidth}
                  />
                ))}
              {loading && (
                <Defs.ColumnsPlaceholder
                  height={maxHeight > 0 ? maxHeight : placeholderHeight}
                  gapBetweenColumns={gapBetweenColumns}
                  sankeyColumnsWidth={sankeyColumnsWidth}
                  size={extraColumnId ? MIN_COLUMNS_NUMBER + 1 : MIN_COLUMNS_NUMBER}
                />
              )}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

Sankey.propTypes = {
  links: PropTypes.array,
  columns: PropTypes.array,
  toolColumns: PropTypes.object,
  maxHeight: PropTypes.number,
  detailedView: PropTypes.bool,
  flowsLoading: PropTypes.bool,
  hasExpandedNodesIds: PropTypes.bool, // eslint-disable-line
  selectedResizeBy: PropTypes.object,
  selectedRecolorBy: PropTypes.object,
  highlightedNodeId: PropTypes.number,
  gapBetweenColumns: PropTypes.number,
  nodeHeights: PropTypes.object,
  otherNodes: PropTypes.object,
  selectedContext: PropTypes.object,
  nodeAttributes: PropTypes.object,
  selectedMapDimensions: PropTypes.array,
  onExpandClick: PropTypes.func.isRequired, // eslint-disable-line
  sankeyColumnsWidth: PropTypes.number.isRequired,
  onNodeClicked: PropTypes.func.isRequired,
  onCollapseClick: PropTypes.func.isRequired, // eslint-disable-line
  onNodeHighlighted: PropTypes.func.isRequired,
  onChangeExtraColumn: PropTypes.func.isRequired,
  selectedNodesIds: PropTypes.array.isRequired,
  toolLayout: PropTypes.number.isRequired,
  extraColumnId: PropTypes.number,
  extraColumnNodeId: PropTypes.number
};

export default Sankey;
