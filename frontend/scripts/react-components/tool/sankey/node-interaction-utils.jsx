import React from 'react';
import pluralize from 'utils/pluralize';
import getNodeMeta from 'app/helpers/getNodeMeta';
import formatValue from 'utils/formatValue';
import { NODE_TYPES } from 'constants';
import RecolorByLegend from './recolor-by-legend';

// Indicators can have related children indicators
const getChildrenResizeByItems = (childrenNodeHeights, id, selectedContext) => {
  const relatedNodeHeights = childrenNodeHeights?.[id]?.extraAttributes;
  return (
    relatedNodeHeights &&
    Object.entries(relatedNodeHeights).map(([childrenIndicatorId, value]) => {
      const childrenIndicator = selectedContext.resizeBy.find(
        n => String(n.attributeId) === childrenIndicatorId
      );
      return {
        title: childrenIndicator?.label,
        unit: childrenIndicator?.unit,
        value: `${formatValue(value, childrenIndicator?.label)}`
      };
    })
  );
};

export const handleNodeOver = ({
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
  childrenNodeHeights,
  nodeAttributes,
  toolColumns,
  columns,
  scrollContainerRef,
  sankeyColumnsWidth,
  links
}) => {
  const rect = getRect(toolLayout);
  const { columnId, id, name, x: nodeX, y: nodeY } = node;
  const nodeHeight = nodeHeights[id];
  const otherNodeCount = otherNodes && otherNodes[id] && otherNodes[id].count;
  const scrollY = scrollContainerRef?.current?.scrollTop || 0;
  const tooltipPadding = 10;
  const minTooltipWidth = 180;
  const resizeByItem = {
    title: selectedResizeBy.label,
    unit: selectedResizeBy.unit,
    value: `${formatValue(nodeHeight.quant, selectedResizeBy.label)}`
  };

  const childrenResizeByItems = getChildrenResizeByItems(childrenNodeHeights, id, selectedContext);
  const nodeGroup = toolColumns && toolColumns[columnId] && toolColumns[columnId].group;
  const isFromFirstColumn = nodeGroup === 0;
  const isFromLastColumn = nodeGroup === columns.length - 1;

  const isDeforestationExposureException =
    isFromFirstColumn && resizeByItem.title.toLowerCase().endsWith('deforestation exposure');

  const tooltip = {
    text: name,
    items: isDeforestationExposureException ? [] : [resizeByItem, ...childrenResizeByItems],
    width: rect.width,
    height: rect.height,
    x:
      // this math is here to prevent overflow from the viewport, or the tooltip appearing on top of the mouse
      nodeX + sankeyColumnsWidth + tooltipPadding > rect.width - minTooltipWidth
        ? nodeX
        : nodeX + sankeyColumnsWidth,
    y: nodeY - tooltipPadding - scrollY
  };

  const hasDimensionSelected =
    nodeAttributes && selectedMapDimensions && selectedMapDimensions.length > 0;

  // Last column nodes should only show the Trade volume on the tooltip
  if (isFromLastColumn) {
    const associatedLinks = links.filter(l => l.targetNodeId === id);
    const value = associatedLinks.reduce((acc, curr) => acc + curr.quant, 0);
    const formattedValue = formatValue(value, selectedResizeBy.label);
    tooltip.items = [
      {
        title: `Selection ${selectedResizeBy.label}`,
        unit: selectedResizeBy.unit,
        value: formattedValue
      },
      { ...resizeByItem, title: `Total ${selectedResizeBy.label}` },
      ...childrenResizeByItems
    ];
  } else if (hasDimensionSelected) {
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

  // Tooltip disclaimer only for Argentina Soy Other node
  const { commodityName, countryName } = selectedContext;
  if (commodityName === 'SOY' && countryName === 'ARGENTINA' && name === 'IMPORTS + STOCK') {
    setTooltipDisclaimer(
      'Sources include soybean imports from other countries and Argentina’s production that is part of the soybean stock'
    );
  } else {
    setTooltipDisclaimer(null);
  }
  // Country menu can be enabled if we have country profiles or other node is selected and we can expand
  const enabledCountryMenu =
    node.type === NODE_TYPES.countryOfProduction && selectedNodesIds.length;

  if (selectedNodesIds.includes(node.id) || enabledCountryMenu) {
    setHoveredSelectedNode(node);
  }

  setTooltipContent(tooltip);
  onNodeHighlighted(node.id);
};

export const handleLinkOver = ({
  e,
  link,
  getRect,
  setTooltipContent,
  setHoveredLink,
  selectedResizeBy,
  selectedRecolorBy,
  toolLayout
}) => {
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
