import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import formatValue from 'utils/formatValue';
import getNodeMeta from 'app/helpers/getNodeMeta';
import Heading from 'react-components/shared/heading';
import UnitsTooltip from 'react-components/shared/units-tooltip/units-tooltip.component';
import { TOOL_LAYOUT, MIN_COLUMNS_NUMBER, NODE_TYPES } from 'constants';
import pluralize from 'utils/pluralize';

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
    lastSelectedNodeLink,
    onChangeExtraColumn,
    toolColumns,
    columns,
    extraColumnId,
    extraColumnNodeId,
    selectedNodesIds
  } = props;
  return useMemo(() => {
    const items = [];

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
    const DISALLOW_NODE_TYPES = [
      NODE_TYPES.economicBloc,
      NODE_TYPES.districtOfExport,
      NODE_TYPES.biome
    ];
    if (!ENABLE_COUNTRY_PROFILES) {
      DISALLOW_NODE_TYPES.push(NODE_TYPES.countryOfProduction);
      DISALLOW_NODE_TYPES.push(NODE_TYPES.country);
    }
    if (link.profileType && !DISALLOW_NODE_TYPES.includes(nodeType)) {
      items.splice(2, 0, {
        id: 'profile-link',
        label: `Go To The ${
          nodeType === NODE_TYPES.countryOfProduction ? 'Country' : nodeType
        } Profile`,
        onClick: () => goToProfile(link)
      });
    }

    const activeColumn = toolColumns && Object.values(toolColumns).find(c => c.name === nodeType);
    const selectedNode =
      columns?.length &&
      activeColumn &&
      columns[activeColumn.group].values.find(node => node.id === link.nodeId);

    if (nodeType && activeColumn?.filterTo && columns?.length) {
      const columnToExpand = toolColumns[activeColumn.filterTo];

      if (extraColumnId) {
        items.push({
          id: 'remove-column',
          label: `Close ${pluralize(columnToExpand.name)}`,
          onClick: () => onChangeExtraColumn(null)
        });
      } else {
        items.push({
          id: 'expand-column',
          label: `See ${pluralize(columnToExpand.name)}`,
          onClick: () => onChangeExtraColumn(columnToExpand.id, activeColumn.id, selectedNode?.id)
        });
      }
    }
    const hasExtraColumn = extraColumnId && selectedNode?.id === extraColumnNodeId;

    if ((isReExpand || !hasExpandedNodesIds) && !hasExtraColumn && selectedNodesIds.length > 0) {
      items.push({
        id: 'expand',
        label: isReExpand ? 'Re-Expand' : 'Expand',
        onClick: onExpandClick
      });
    }

    if (hasExpandedNodesIds && !hasExtraColumn && selectedNodesIds.length > 0) {
      items.push({ id: 'collapse', label: 'Collapse', onClick: onCollapseClick });
    }

    return items;
  }, [
    lastSelectedNodeLink,
    hoveredSelectedNode,
    toolColumns,
    columns,
    extraColumnNodeId,
    isReExpand,
    hasExpandedNodesIds,
    goToProfile,
    extraColumnId,
    onChangeExtraColumn,
    onExpandClick,
    onCollapseClick,
    selectedNodesIds
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
    extraColumnId
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
    const rect = getRect(toolLayout);
    const nodeHeight = nodeHeights[node.id];
    const otherNodeCount = otherNodes && otherNodes[node.id] && otherNodes[node.id].count;
    const scrollY = scrollContainerRef?.current?.scrollTop || 0;
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
      y: node.y - tooltipPadding - scrollY
    };
    // Importing countries (Country of import) should only show the trade volume on the tooltip
    if (
      nodeAttributes &&
      selectedMapDimensions &&
      selectedMapDimensions.length > 0 &&
      node.type !== NODE_TYPES.country
    ) {
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

      if (otherNodeCount) {
        tooltip.items.push({
          title: pluralize(node.type),
          unit: null,
          value: otherNodeCount
        });
      }
    }
    // Country menu can be enabled if we have country profiles or other node is selected and we can expand
    const enabledCountryMenu =
      node.type === NODE_TYPES.countryOfProduction &&
      (selectedNodesIds.length || ENABLE_COUNTRY_PROFILES);
    if (selectedNodesIds.includes(node.id) || enabledCountryMenu) {
      setHoveredSelectedNode(node);
    }

    setTooltipContent(tooltip);
    onNodeHighlighted(node.id);
  };

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
      <UnitsTooltip {...tooltipContent} show={!!tooltipContent} />
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
                    className={cx(getLinkColor(link), { '-hover': hoveredLink === link.id })}
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
  isReExpand: PropTypes.bool, // eslint-disable-line
  hasExpandedNodesIds: PropTypes.bool, // eslint-disable-line
  selectedResizeBy: PropTypes.object,
  selectedRecolorBy: PropTypes.object,
  highlightedNodeId: PropTypes.number,
  gapBetweenColumns: PropTypes.number,
  nodeHeights: PropTypes.object,
  otherNodes: PropTypes.object,
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
