import { createSelector } from 'reselect';
import fuzzySearch from 'utils/fuzzySearch';
import groupBy from 'lodash/groupBy';
import flatten from 'lodash/flatten';
import { getSelectedYears } from 'app/app.selectors';

const getAppSearch = state => state.app.search;

const filterSearch = createSelector([getAppSearch, getSelectedYears], (search, selectedYears) => {
  const [start, end] = selectedYears;
  const filtered = search.results.filter(
    result => result.years.includes(start) && result.years.includes(end)
  );
  return fuzzySearch(search.term, filtered);
});

const getGroupedNodes = createSelector([filterSearch], allNodes =>
  Object.values(groupBy(allNodes, 'mainId'))
);

export const getSearchResults = createSelector([getGroupedNodes], nodes => {
  const getNode = (groupedNodes) => {
    const nodeTypes = groupedNodes.map(n => n.nodeType);

    // TODO: Check why are we grouping importer and exporters on this code
    if (nodeTypes.includes('IMPORTER') && nodeTypes.includes('EXPORTER')) {
      const importerNode = groupedNodes.find(n => n.nodeType === 'IMPORTER');
      const exporterNode = groupedNodes.find(n => n.nodeType === 'EXPORTER');
      const restNodes = groupedNodes.filter(n => n.nodeType !== 'IMPORTER' && n.nodeType !== 'EXPORTER');
      return [{
        id: `${importerNode.id}_${exporterNode.id}`,
        name: importerNode.name,
        nodeType: 'IMPORTER & EXPORTER',
        profile: importerNode.profile,
        [importerNode.nodeType.toLowerCase()]: importerNode,
        [exporterNode.nodeType.toLowerCase()]: exporterNode,
        nodes: [importerNode.nodeType.toLowerCase(), exporterNode.nodeType.toLowerCase()]
      }, ...restNodes];
    }

    return groupedNodes;
  };

  return flatten(nodes.map(groupedNodes => getNode(groupedNodes)));
});
