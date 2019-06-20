import { createSelector } from 'reselect';
import fuzzySearch from 'utils/fuzzySearch';
import groupBy from 'lodash/groupBy';
import flatten from 'lodash/flatten';

const getAppSearch = state => state.app.search;

const filterSearch = createSelector(
  [getAppSearch],
  search => fuzzySearch(search.term, search.results)
);

const getGroupedNodes = createSelector(
  [filterSearch],
  allNodes => Object.values(groupBy(allNodes, 'mainId'))
);

export const getSearchResults = createSelector(
  [getGroupedNodes],
  nodes => {
    const getNode = ([nodeA, nodeB]) => {
      if (nodeB) {
        const nodeTypes = [nodeA, nodeB].map(n => n.nodeType);
        if (nodeTypes.includes('IMPORTER') && nodeTypes.includes('EXPORTER')) {
          return {
            id: `${nodeA.id}_${nodeB.id}`,
            name: nodeA.name,
            nodeType: 'IMPORTER & EXPORTER',
            profile: nodeA.profile,
            [nodeA.nodeType.toLowerCase()]: nodeA,
            [nodeB.nodeType.toLowerCase()]: nodeB
          };
        }
        return [nodeA, nodeB];
      }
      return nodeA;
    };

    return flatten(nodes.map(groupedNodes => getNode(groupedNodes)));
  }
);
