import pluralize from 'utils/pluralize';
import getNodeMeta from 'app/helpers/getNodeMeta';
import formatValue from 'utils/formatValue';
import { NODE_TYPES } from 'constants';

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

  const nodeGroup = toolColumns && toolColumns[columnId] && toolColumns[columnId].group;
  const isFromFirstColumn = nodeGroup === 0;
  const isFromLastColumn = nodeGroup === columns.length - 1;

  const isDeforestationExposureException =
    isFromFirstColumn && resizeByItem.title.toLowerCase().endsWith('deforestation exposure');

  const tooltip = {
    text: name,
    items: isDeforestationExposureException ? [] : [resizeByItem],
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
      { ...resizeByItem, title: `Total ${selectedResizeBy.label}` }
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
