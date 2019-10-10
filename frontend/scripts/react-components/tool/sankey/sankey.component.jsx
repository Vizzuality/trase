import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import formatValue from 'utils/formatValue';
import getNodeMeta from 'reducers/helpers/getNodeMeta';
import Heading from 'react-components/shared/heading';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import { TOOL_LAYOUT } from 'constants';

import RecolorByLegend from './recolor-by-legend';
import SankeyColumn from './sankey-column.component';
import NodeMenu from './node-menu.component';
import SankeyLink from './sankey-link.component';
import * as Defs from './sankey-defs.component';

import 'react-components/tool/sankey/sankey.scss';

function useMenuOptions(props, hoveredSelectedNode) {
  const {
    goToProfile,
    hasExpandedNodesIds,
    isReExpand,
    onExpandClick,
    onCollapseClick,
    onClearClick,
    lastSelectedNodeLink
  } = props;
  return useMemo(() => {
    const items = [
      { id: 'expand', label: isReExpand ? 'Re-Expand' : 'Expand', onClick: onExpandClick },
      { id: 'collapse', label: 'Collapse', onClick: onCollapseClick },
      { id: 'clear', label: 'Clear Selection', onClick: onClearClick }
    ];

    let nodeType = null;
    let link = {};

    if (lastSelectedNodeLink) {
      const { type, ...params } = lastSelectedNodeLink;
      nodeType = type;
      link = {
        ...params
      };
    }

    if (
      hoveredSelectedNode &&
      hoveredSelectedNode.isUnknown !== true &&
      hoveredSelectedNode.isDomesticConsumption !== true
    ) {
      nodeType = hoveredSelectedNode.type;
      link.profileType = hoveredSelectedNode.profileType;
      link.nodeId = hoveredSelectedNode.id;
    }

    if (link.profileType) {
      items.splice(2, 0, {
        id: 'profile-link',
        label: `Go To The ${nodeType} Profile`,
        onClick: () => goToProfile(link)
      });
    }

    if (!isReExpand && hasExpandedNodesIds) {
      return items.filter(item => item.id !== 'expand');
    }
    if (!hasExpandedNodesIds) {
      return items.filter(item => item.id !== 'collapse');
    }

    return items;
  }, [
    hoveredSelectedNode,
    lastSelectedNodeLink,
    hasExpandedNodesIds,
    isReExpand,
    onClearClick,
    onCollapseClick,
    onExpandClick,
    goToProfile
  ]);
}

function useMenuPosition(props) {
  const { selectedNodesIds, isReExpand, columns } = props;
  const [hoveredSelectedNode, setHoveredSelectedNode] = useState(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const getCoordinates = n => ({
    x: n.x,
    y: Math.max(0, n.y) + (ref.current?.scrollTop || 0)
  });

  useEffect(() => {
    setHoveredSelectedNode(null);
  }, [selectedNodesIds]);

  useEffect(() => {
    if (!columns) {
      return;
    }
    if (hoveredSelectedNode) {
      const coordinates = getCoordinates(hoveredSelectedNode);
      setMenuPos(coordinates);
    } else {
      // use some to stop iterating once its found
      columns.some(column =>
        column.values.some(node => {
          const last = selectedNodesIds.length - 1;
          if (node.id === selectedNodesIds[last]) {
            const coordinates = getCoordinates(node);
            setMenuPos(coordinates);
            return true;
          }
          return false;
        })
      );
    }
  }, [selectedNodesIds, columns, isReExpand, hoveredSelectedNode]);

  return [menuPos, ref, hoveredSelectedNode, setHoveredSelectedNode];
}

function useNodeRefHeight(ref) {
  const [height, setHeight] = useState(undefined);
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return height;
}

function Sankey(props) {
  const {
    columns,
    links,
    maxHeight,
    flowsLoading,
    nodeHeights,
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
    toolLayout
  } = props;
  const [hoveredLink, setHoveredLink] = useState(null);
  const [tooltipContent, setTooltipContent] = useState(null);
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

  const getLinkColor = link => {
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
      classPath = `${classPath} -recolorby-${legendTypeClass}-${legendColorThemeClass}-${recolorBy}`;
    } else {
      classPath = `${classPath} -recolorgroup-${link.recolorGroup}`;
    }

    return classPath;
  };

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

  const onNodeOver = (e, node) => {
    if (node.isAggregated) {
      return;
    }

    const rect = getRect(toolLayout);

    const nodeHeight = nodeHeights[node.id];
    const tooltipPadding = 10;
    const minTooltipWidth = 180;
    const tooltip = {
      text: node.name,
      items: [
        {
          title: selectedResizeBy.label,
          unit: selectedResizeBy.unit,
          value: `${formatValue(nodeHeight.quant, selectedResizeBy.label)}`
        }
      ],
      width: rect.width,
      height: rect.height,
      x:
        // this math is here to prevent overflow from the viewport, or the tooltip appearing on top of the mouse
        node.x + sankeyColumnsWidth + tooltipPadding > rect.width - minTooltipWidth
          ? node.x
          : node.x + sankeyColumnsWidth,
      y: node.y - tooltipPadding
    };
    if (nodeAttributes && selectedMapDimensions && selectedMapDimensions.length > 0) {
      const nodeIndicators = selectedMapDimensions
        .map(dimension => {
          const meta = getNodeMeta(dimension, node, nodeAttributes, selectedResizeBy, nodeHeights);
          if (!meta) {
            return null;
          }
          return {
            title: dimension.name,
            unit: dimension.unit,
            value: formatValue(meta.value, dimension.name)
          };
        })
        .filter(Boolean);

      tooltip.items.push(...nodeIndicators);
    }

    if (selectedNodesIds.includes(node.id)) {
      setHoveredSelectedNode(node);
    }

    setTooltipContent(tooltip);
    onNodeHighlighted(node.id);
  };

  const onNodeOut = (e, node) => {
    if (node.isAggregated) {
      return;
    }
    setTooltipContent(null);
    onNodeHighlighted(null);
  };

  const loading = !columns || columns.length === 0 || !links || flowsLoading;

  return (
    <div className={cx('c-sankey', { '-full-screen': toolLayout === TOOL_LAYOUT.right })}>
      <UnitsTooltip {...tooltipContent} show={!!tooltipContent} />
      <div
        ref={scrollContainerRef}
        className={cx('sankey-scroll-container', { '-detailed': detailedView })}
      >
        {loading && (
          <div
            className="sankey-loading"
            style={{ left: gapBetweenColumns + 2 * sankeyColumnsWidth + gapBetweenColumns / 2 }}
          >
            <Heading variant="mono" size="md" weight="bold">
              Loading
            </Heading>
          </div>
        )}
        {!loading && (
          <NodeMenu
            menuPos={menuPos}
            isVisible={selectedNodesIds.length > 0}
            options={menuOptions}
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
              selectedNodesIds={selectedNodesIds}
              selectedRecolorBy={selectedRecolorBy}
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
                    className={cx(getLinkColor(link), { '-hover': hoveredLink === link.id })}
                  />
                ))}
              {loading && (
                <Defs.LinksPlaceHolder
                  height={placeholderHeight}
                  gapBetweenColumns={gapBetweenColumns}
                  sankeyColumnsWidth={sankeyColumnsWidth}
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
                  height={placeholderHeight}
                  gapBetweenColumns={gapBetweenColumns}
                  sankeyColumnsWidth={sankeyColumnsWidth}
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
  maxHeight: PropTypes.number,
  detailedView: PropTypes.bool,
  flowsLoading: PropTypes.bool,
  isReExpand: PropTypes.bool, // eslint-disable-line
  hasExpandedNodesIds: PropTypes.bool, // eslint-disable-line
  selectedResizeBy: PropTypes.object,
  selectedRecolorBy: PropTypes.object,
  highlightedNodeId: PropTypes.number,
  gapBetweenColumns: PropTypes.number,
  nodeHeights: PropTypes.object,
  nodeAttributes: PropTypes.object,
  selectedMapDimensions: PropTypes.array,
  onClearClick: PropTypes.func.isRequired, // eslint-disable-line
  onExpandClick: PropTypes.func.isRequired, // eslint-disable-line
  sankeyColumnsWidth: PropTypes.number.isRequired,
  onNodeClicked: PropTypes.func.isRequired,
  onCollapseClick: PropTypes.func.isRequired, // eslint-disable-line
  onNodeHighlighted: PropTypes.func.isRequired,
  selectedNodesIds: PropTypes.array.isRequired,
  toolLayout: PropTypes.number.isRequired
};

export default Sankey;
