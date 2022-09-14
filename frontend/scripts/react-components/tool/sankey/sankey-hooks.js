import { useEffect, useRef, useState, useMemo } from 'react';
import { NODE_TYPES } from 'constants';
import pluralize from 'utils/pluralize';

export const useMenuOptions = (props, hoveredSelectedNode) => {
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
        icon: 'expand',
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
};

export const useMenuPosition = props => {
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
};

export const useNodeRefHeight = ref => {
  const [height, setHeight] = useState(undefined);
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return height;
};
