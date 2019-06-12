import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import isNodeColumnVisible from 'utils/isNodeColumnVisible';
import { getSelectedColumnsIds } from 'react-components/tool/tool.selectors';

const getToolNodes = state => state.toolLinks && state.toolLinks.data.nodes;
const getToolColumns = state => state.toolLinks && state.toolLinks.data.columns;

const getAllToolSearchNodes = createSelector(
  getToolNodes,
  nodes =>
    nodes &&
    Object.values(nodes).filter(
      node =>
        node.hasFlows === true &&
        node.isAggregated !== true &&
        node.isUnknown !== true &&
        node.isDomesticConsumption !== true
    )
);

const getGroupedNodes = createSelector(
  [getAllToolSearchNodes],
  allNodes => Object.values(groupBy(allNodes, 'mainNodeId'))
);

export const getToolSearchNodes = createSelector(
  [getGroupedNodes, getSelectedColumnsIds, getToolNodes, getToolColumns],
  (groupedNodes, selectedColumnsIds, nodes, columns) => {
    if (!nodes || !columns) {
      return [];
    }

    const getNode = ([nA, nB]) => {
      if (nB) {
        if (
          isNodeColumnVisible(columns[nA.columnId], selectedColumnsIds) &&
          isNodeColumnVisible(columns[nB.columnId], selectedColumnsIds)
        ) {
          return {
            id: `${nA.id}_${nB.id}`,
            name: nA.name,
            type: `${nA.type} & ${nB.type}`,
            profileType: columns[nA.columnId].profileType,
            [nA.type.toLowerCase()]: nA,
            [nB.type.toLowerCase()]: nB
          };
        }
        return [nA, nB];
      }
      return nA;
    };

    return flatten(groupedNodes.map(group => getNode(group)));
  }
);
