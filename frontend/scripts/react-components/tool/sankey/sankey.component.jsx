import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import toLower from 'lodash/toLower';
import Tooltip from 'components/shared/info-tooltip.component';
import formatValue from 'utils/formatValue';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import getNodeMeta from 'reducers/helpers/getNodeMeta';
import Heading from 'react-components/shared/heading';
import { TOOL_LAYOUT } from 'constants';

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

  const COLUMN_SELECTOR_HEIGHT = 60;
  const getCoordinates = n => ({
    x: n.x,
    y: Math.max(0, n.y) + COLUMN_SELECTOR_HEIGHT - (ref.current?.scrollTop || 0)
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

function useVanillaTooltip({ links }) {
  const ref = useRef(null);
  const tooltip = useRef(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!tooltip.current && ref.current) {
      tooltip.current = new Tooltip(ref.current);
    }

    if (tooltip.current) {
      if (content) {
        tooltip.current.show(
          content.x,
          content.y,
          content.title,
          content.values,
          content.height,
          content.width
        );
      } else {
        tooltip.current.hide();
      }

      if (!links) {
        tooltip.current.hide();
      }
    }

    return () => {
      if (tooltip.current) {
        tooltip.current.hide();
      }
    };
  }, [content, links]);

  return [ref, setContent];
}

function useDomNodeRect(input) {
  const [rect, setRect] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
  }, [input]);

  return [rect, ref];
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
  const [tooltipRef, setTooltip] = useVanillaTooltip(props);
  const [rect, svgRef] = useDomNodeRect(columns);
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
      let recolorBy = link.recolorBy;
      if (selectedRecolorBy.divisor) {
        recolorBy = Math.floor(link.recolorBy / selectedRecolorBy.divisor);
      }
      const legendTypeClass = toLower(selectedRecolorBy.legendType);
      const legendColorThemeClass = toLower(selectedRecolorBy.legendColorTheme);
      classPath = `${classPath} -recolorby-${legendTypeClass}-${legendColorThemeClass}-${recolorBy}`;
    } else {
      classPath = `${classPath} -recolorgroup-${link.recolorGroup}`;
    }

    return classPath;
  };

  const onLinkOver = (e, link) => {
    const tooltip = {
      title: `${link.sourceNodeName} > ${link.targetNodeName}`,
      x: e.clientX - rect.x,
      y: e.clientY - rect.y,
      height: rect.height,
      width: rect.width,
      values: [
        {
          title: selectedResizeBy.label,
          unit: selectedResizeBy.unit,
          value: formatValue(link.quant, selectedResizeBy.label)
        }
      ]
    };
    if (selectedRecolorBy) {
      let recolorValue = `${link.recolorBy}/${selectedRecolorBy.maxValue}`;
      if (link.recolorBy === null) {
        recolorValue = 'Unknown';
      } else if (selectedRecolorBy.type !== 'ind') {
        recolorValue = capitalize(startCase(link.recolorBy));
      } else if (selectedRecolorBy.legendType === 'percentual') {
        // percentual values are always a range, not the raw value.
        // The value coming from the model is already floored
        // to the start of the bucket (splitLinksByColumn)
        const nextValue = link.recolorBy + selectedRecolorBy.divisor;
        recolorValue = `${link.recolorBy}–${nextValue}%`;
      }
      tooltip.values.push({
        title: selectedRecolorBy.label,
        value: recolorValue
      });
    }

    setHoveredLink(link.id);
    setTooltip(tooltip);
  };

  const onLinkOut = () => {
    setHoveredLink(null);
    setTooltip(null);
  };

  const onNodeOver = (e, node) => {
    if (node.isAggregated) {
      return;
    }

    const nodeHeight = nodeHeights[node.id];
    const tooltipPadding = 10;
    const minTooltipWidth = 180;
    const tooltip = {
      title: node.name,
      values: [
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

      tooltip.values.push(...nodeIndicators);
    }

    if (selectedNodesIds.includes(node.id)) {
      setHoveredSelectedNode(node);
    }

    setTooltip(tooltip);
    onNodeHighlighted(node.id);
  };

  const onNodeOut = (e, node) => {
    if (node.isAggregated) {
      return;
    }
    setTooltip(null);
    onNodeHighlighted(null);
  };

  const loading = !columns || columns.length === 0 || !links || flowsLoading;

  return (
    <div className={cx('c-sankey', { '-full-screen': toolLayout === TOOL_LAYOUT.right })}>
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
        <div ref={tooltipRef} className="c-info-tooltip" />
        <svg
          ref={svgRef}
          className="sankey"
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
