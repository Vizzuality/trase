import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import isNodeColumnVisible from 'utils/isNodeColumnVisible';

const getToolNodes = state => state.toolLinks && state.toolLinks.nodes;
const getSelectedColumnsIds = state => state.toolLinks && state.toolLinks.selectedColumnsIds;
const getNodesDict = state => state.toolLinks && state.toolLinks.nodesDict;

const getAllToolSearchNodes = createSelector(
  getToolNodes,
  nodes =>
    nodes &&
    nodes.filter(
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
  [getGroupedNodes, getSelectedColumnsIds, getNodesDict],
  (nodes, selectedColumnsIds, nodesDict) => {
    const getNode = ([nA, nB]) => {
      if (nB) {
        if (
          isNodeColumnVisible(nodesDict[nA.id], selectedColumnsIds) &&
          isNodeColumnVisible(nodesDict[nB.id], selectedColumnsIds)
        ) {
          return {
            id: `${nA.id}_${nB.id}`,
            name: nA.name,
            type: `${nA.type} & ${nB.type}`,
            profileType: nA.profileType,
            [nA.type.toLowerCase()]: nA,
            [nB.type.toLowerCase()]: nB
          };
        }
        return [nA, nB];
      }
      return nA;
    };

    return flatten(nodes.map(groupedNodes => getNode(groupedNodes)));
  }
);
